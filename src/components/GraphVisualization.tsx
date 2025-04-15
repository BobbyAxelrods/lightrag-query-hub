
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SimpleNetworkGraph } from "./graph/SimpleNetworkGraph";
import { GraphData } from "./graph/types";

interface GraphVisualizationProps {
  graphData: GraphData;
}

export function GraphVisualization({ graphData }: GraphVisualizationProps) {
  const { toast } = useToast();

  useEffect(() => {
    console.log("GraphData:", graphData);
  }, [graphData]);

  const handleNodeClick = (nodeId: string) => {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
      toast({
        title: node.label,
        description: node.properties.description || 'No description available',
      });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4">
        <SimpleNetworkGraph 
          data={graphData}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
}
