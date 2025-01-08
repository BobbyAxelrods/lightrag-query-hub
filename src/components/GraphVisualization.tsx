import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network } from "lucide-react";
import { Network as VisNetwork, Data } from "vis-network";

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const { toast } = useToast();
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<VisNetwork | null>(null);

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

  useEffect(() => {
    if (!networkRef.current || !graphData?.data || isLoading) return;

    // Clean up any existing network
    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    const nodes = graphData.data.nodes.map((node: any) => ({
      id: node.id,
      label: node.label.replace(/"/g, ''),
      title: node.properties.replace(/"/g, ''),
      color: {
        background: '#2563EB',
        border: '#1E40AF',
        highlight: { background: '#3B82F6', border: '#1E40AF' }
      },
      font: { color: '#FFFFFF', size: 14 },
      shape: 'dot',
      size: 20
    }));

    const edges = graphData.data.edges.map((edge: any) => ({
      from: edge.source.replace(/"/g, ''),
      to: edge.target.replace(/"/g, ''),
      label: edge.label.split('"')[1] || '',
      arrows: 'to',
      color: { color: '#94A3B8', highlight: '#64748B' },
      font: { size: 12, align: 'middle' },
      length: 250
    }));

    const data: Data = { nodes, edges };
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        shadow: true,
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5,
          forceDirection: 'none'
        }
      },
      physics: {
        stabilization: {
          iterations: 100
        },
        barnesHut: {
          gravitationalConstant: -10000,
          springConstant: 0.002,
          springLength: 250
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true
      }
    };

    networkInstanceRef.current = new VisNetwork(
      networkRef.current,
      data,
      options
    );

    // Add event listeners
    networkInstanceRef.current.on('click', function(params) {
      if (params.nodes.length > 0) {
        console.log('Clicked node:', params.nodes[0]);
      }
      if (params.edges.length > 0) {
        console.log('Clicked edge:', params.edges[0]);
      }
    });

  }, [graphData, isLoading]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Button
        onClick={handleToggleGraph}
        className="w-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Network className="mr-2 h-4 w-4" />
        {showGraph ? "Hide Network Graph" : "Show Network Graph"}
      </Button>

      {showGraph && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-4 animate-fade-in">
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