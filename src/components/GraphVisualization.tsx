import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ForceGraph2D from "react-force-graph-2d";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network } from "lucide-react";

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const { toast } = useToast();

  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraphAPI,
    enabled: showGraph,
  });

  const handleToggleGraph = () => {
    setShowGraph(!showGraph);
    if (!showGraph) {
      toast({
        title: "Loading Graph",
        description: "Fetching network visualization data...",
      });
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load graph data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Button
        onClick={handleToggleGraph}
        className="w-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Network className="mr-2 h-4 w-4" />
        {showGraph ? "Hide Network Graph" : "Show Network Graph"}
      </Button>

      {showGraph && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-4 h-[600px] animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
            </div>
          ) : (
            graphData && (
              <ForceGraph2D
                graphData={{
                  nodes: graphData.data.nodes.map((node) => ({
                    id: node.id,
                    label: node.label.join(", "),
                    ...node.properties,
                  })),
                  links: graphData.data.edges.map((edge) => ({
                    source: edge.source,
                    target: edge.target,
                    label: edge.label,
                  })),
                }}
                nodeLabel="label"
                linkLabel="label"
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                  const label = node.label;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  ctx.fillStyle = '#000';
                  ctx.textAlign = 'center';
                  ctx.fillText(label, node.x, node.y);
                }}
                backgroundColor="#ffffff"
                linkColor={() => "#999"}
                nodeColor={() => "#2563EB"}
                width={800}
                height={550}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}