
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { SimpleNetworkGraph } from "./graph/SimpleNetworkGraph";

export function GraphVisualization() {
  const { toast } = useToast();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraphAPI
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load graph data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = graphData?.nodes.find(n => n.id === nodeId);
    if (node) {
      toast({
        title: node.label,
        description: Object.entries(node.properties)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
      });
    }
  };

  if (error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
          </div>
        ) : graphData && (
          <SimpleNetworkGraph 
            data={graphData}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>
    </div>
  );
}
