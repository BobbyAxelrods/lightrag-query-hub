
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Network as VisNetwork } from "vis-network";
import { NetworkControls } from "./NetworkControls";
import { NetworkView } from "./NetworkView";

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [networkInstance, setNetworkInstance] = useState<VisNetwork | null>(null);
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

  const handleToggleLabels = () => {
    setShowLabels(!showLabels);
    if (networkInstance) {
      const nodesDataSet = networkInstance.getSelectedNodes();
      nodesDataSet.forEach((nodeId) => {
        networkInstance.updateNode(nodeId, {
          font: { size: showLabels ? 0 : 14 }
        });
      });
    }
  };

  const handleNetworkInit = useCallback((network: VisNetwork) => {
    setNetworkInstance(network);
  }, []);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load graph data",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <NetworkControls
        showGraph={showGraph}
        showLabels={showLabels}
        onToggleGraph={handleToggleGraph}
        onToggleLabels={handleToggleLabels}
      />

      {showGraph && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
            </div>
          ) : (
            <NetworkView
              graphData={graphData}
              showLabels={showLabels}
              onNetworkInit={handleNetworkInit}
            />
          )}
        </div>
      )}
    </div>
  );
}
