
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network, Eye, EyeOff, Minimize2 } from "lucide-react";
import { Network as VisNetwork, Data } from "vis-network";

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<VisNetwork | null>(null);
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
    if (networkInstanceRef.current) {
      const nodes = networkInstanceRef.current.body.data.nodes.get();
      nodes.forEach((node: any) => {
        networkInstanceRef.current?.body.data.nodes.update({
          id: node.id,
          font: { size: showLabels ? 0 : 14 }
        });
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

  useEffect(() => {
    if (!networkRef.current || !graphData?.data || isLoading) return;

    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    const nodes = graphData.data.nodes.map((node: any) => ({
      id: node.id,
      label: node.label,
      color: {
        background: '#2563EB',
        border: '#1E40AF',
      },
      font: { size: showLabels ? 14 : 0 }
    }));

    const edges = graphData.data.edges.map((edge: any) => ({
      from: edge.source,
      to: edge.target,
      label: edge.label,
      arrows: 'to',
      color: { color: '#94A3B8' }
    }));

    const data: Data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        borderWidth: 2,
      },
      edges: {
        width: 2,
        smooth: {
          enabled: true,
          type: 'continuous'
        }
      },
      physics: {
        stabilization: true,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
      },
      height: '600px'
    };

    try {
      networkInstanceRef.current = new VisNetwork(
        networkRef.current,
        data,
        options
      );

      networkInstanceRef.current.once('stabilizationIterationsDone', function() {
        networkInstanceRef.current?.fit();
      });
    } catch (err) {
      console.error('Error initializing network:', err);
      toast({
        title: "Error",
        description: "Failed to initialize network visualization",
        variant: "destructive",
      });
    }
  }, [graphData, isLoading, toast, showLabels]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex gap-2 mb-4">
        <Button onClick={handleToggleGraph}>
          <Network className="mr-2 h-4 w-4" />
          {showGraph ? "Hide Network Graph" : "Show Network Graph"}
        </Button>

        {showGraph && (
          <Button onClick={handleToggleLabels} variant="outline">
            {showLabels ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Labels
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Labels
              </>
            )}
          </Button>
        )}
      </div>

      {showGraph && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
            </div>
          ) : (
            <div ref={networkRef} className="w-full h-[600px] border border-gray-200 rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}
