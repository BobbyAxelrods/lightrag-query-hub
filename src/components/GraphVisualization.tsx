import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network as NetworkIcon } from "lucide-react";

interface Node {
  id: string;
  label: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  label: string;
  arrows: string;
}

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const networkContainer = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (graphData && networkContainer.current) {
      console.log("Graph Data:", graphData); // Debug log

      // Process nodes
      const nodes = new DataSet<Node>(
        graphData.data.nodes.map((node: any) => ({
          id: node.id,
          label: node.label,
        }))
      );

      // Process edges with proper typing and unique IDs
      const edges = new DataSet<Edge>(
        graphData.data.edges.map((edge: any, index: number) => ({
          id: `e${index}`,
          from: edge.source.replace(/"/g, ''), // Remove quotes
          to: edge.target.replace(/"/g, ''), // Remove quotes
          label: edge.label.replace(/"/g, ''), // Remove quotes
          arrows: "to",
        }))
      );

      const options = {
        nodes: {
          shape: "circle",
          size: 30,
          font: { 
            size: 14,
            face: 'arial'
          },
          color: {
            background: "#2563EB",
            border: "#1d4ed8",
            highlight: { background: "#3b82f6", border: "#2563EB" },
          },
        },
        edges: {
          arrows: "to",
          font: { 
            align: "middle",
            size: 12
          },
          color: { color: "#94a3b8", highlight: "#64748b" },
          smooth: {
            type: "cubicBezier",
            forceDirection: "horizontal",
            roundness: 0.4
          }
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 200,
            springConstant: 0.04,
          },
        },
        layout: {
          improvedLayout: true,
          hierarchical: false
        }
      };

      const network = new Network(networkContainer.current, { nodes, edges }, options);

      return () => {
        network.destroy();
      };
    }
  }, [graphData]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Button
        onClick={handleToggleGraph}
        className="w-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <NetworkIcon className="mr-2 h-4 w-4" />
        {showGraph ? "Hide Network Graph" : "Show Network Graph"}
      </Button>

      {showGraph && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-4 animate-fade-in">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
            </div>
          ) : (
            <div ref={networkContainer} className="w-full h-[600px] border border-gray-200 rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}