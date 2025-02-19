
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SimpleNetworkGraph } from "./graph/SimpleNetworkGraph";
import { GraphControls } from "./graph/GraphControls";
import { GraphData } from "./graph/types";

interface GraphVisualizationProps {
  graphData: GraphData;
}

export function GraphVisualization({ graphData }: GraphVisualizationProps) {
  const { toast } = useToast();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hideIsolatedNodes, setHideIsolatedNodes] = useState(true);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
      toast({
        title: node.label,
        description: Object.entries(node.properties)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <GraphControls
        showGraph={showGraph}
        showLabels={showLabels}
        hideIsolatedNodes={hideIsolatedNodes}
        onToggleGraph={() => setShowGraph(!showGraph)}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onToggleIsolatedNodes={() => setHideIsolatedNodes(!hideIsolatedNodes)}
      />

      {showGraph && (
        <div className="flex-1 mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4">
          <SimpleNetworkGraph 
            data={graphData}
            onNodeClick={handleNodeClick}
            showLabels={showLabels}
            hideIsolatedNodes={hideIsolatedNodes}
          />
        </div>
      )}
    </div>
  );
}
