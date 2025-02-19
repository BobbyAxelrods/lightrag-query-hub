
import { useState, useEffect } from "react";
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
  const [hideIsolatedNodes, setHideIsolatedNodes] = useState(false);

  useEffect(() => {
    console.log("GraphVisualization mounted with data:", graphData);
  }, []);

  useEffect(() => {
    console.log("GraphData updated:", graphData);
  }, [graphData]);

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

  // Add initial test data if no graph data is provided
  const testData: GraphData = {
    nodes: [
      {
        id: "test-1",
        label: "Test Node 1",
        properties: {
          content: "Test Content 1",
          type: "test",
          timestamp: new Date().toISOString()
        }
      },
      {
        id: "test-2",
        label: "Test Node 2",
        properties: {
          content: "Test Content 2",
          type: "test",
          timestamp: new Date().toISOString()
        }
      }
    ],
    edges: [
      {
        from: "test-1",
        to: "test-2",
        label: "TEST_RELATION"
      }
    ]
  };

  const displayData = graphData?.nodes?.length ? graphData : testData;

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

      {showGraph && displayData && (
        <div className="flex-1 mt-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4">
          <SimpleNetworkGraph 
            data={displayData}
            onNodeClick={handleNodeClick}
            showLabels={showLabels}
            hideIsolatedNodes={hideIsolatedNodes}
          />
        </div>
      )}
    </div>
  );
}
