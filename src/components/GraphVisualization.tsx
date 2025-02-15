
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { NetworkGraph } from "./graph/NetworkGraph";
import { NodeDetails } from "./graph/NodeDetails";

export function GraphVisualization() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraphAPI,
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

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
    setIsDetailsOpen(true);
  };

  if (error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
          </div>
        ) : graphData && (
          <NetworkGraph
            graphData={graphData}
            onNodeSelect={handleNodeSelect}
          />
        )}
      </div>

      <NodeDetails
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        selectedNode={selectedNode}
      />
    </div>
  );
}
