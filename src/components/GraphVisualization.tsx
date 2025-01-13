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

    console.log("Graph Data:", graphData.data); // Debug log

    const nodes = graphData.data.nodes.map((node: any) => ({
      id: node.id,
      label: node.entity_type?.replace(/"/g, '') || node.label?.replace(/"/g, '') || 'Unknown',
      title: node.description?.replace(/"/g, '') || node.properties?.replace(/"/g, '') || '',
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
      from: edge.source,  // Remove the replace(/"/g, '') as IDs should match exactly
      to: edge.target,    // Remove the replace(/"/g, '') as IDs should match exactly
      label: edge.description?.replace(/"/g, '') || edge.label?.replace(/"/g, '') || '',
      arrows: {
        to: {
          enabled: true,
          type: 'arrow'
        }
      },
      color: { color: '#94A3B8', highlight: '#64748B' },
      font: { size: 12, align: 'middle' },
      length: 250,
      smooth: {
        enabled: true,
        type: 'continuous',
        roundness: 0.5
      }
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
        enabled: true,
        stabilization: {
          iterations: 100,
          fit: true
        },
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.04,
          springLength: 200
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        navigationButtons: true,
        keyboard: true
      },
      height: '600px'
    };

    try {
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

      // Fit the network to view after initialization
      networkInstanceRef.current.once('afterDrawing', function() {
        if (networkInstanceRef.current) {
          networkInstanceRef.current.fit();
        }
      });
    } catch (err) {
      console.error('Error initializing network:', err);
      toast({
        title: "Error",
        description: "Failed to initialize network visualization",
        variant: "destructive",
      });
    }

  }, [graphData, isLoading, toast]);

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