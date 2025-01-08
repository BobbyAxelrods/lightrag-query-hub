import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network } from "lucide-react";
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const { toast } = useToast();
  const cyRef = useRef<Cytoscape.Core | null>(null);

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

  const elements = graphData?.data ? [
    ...graphData.data.nodes.map((node: any) => ({
      data: { 
        id: node.id,
        label: node.label 
      }
    })),
    ...graphData.data.edges.map((edge: any) => ({
      data: {
        id: `e${edge.source}-${edge.target}`,
        source: edge.source.replace(/"/g, ''),
        target: edge.target.replace(/"/g, ''),
        label: edge.label.replace(/"/g, '')
      }
    }))
  ] : [];

  const layout = {
    name: 'cose',
    padding: 50,
    animate: true,
    nodeDimensionsIncludeLabels: true
  };

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#2563EB',
        'label': 'data(label)',
        'color': '#000000',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 50,
        'height': 50
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#94a3b8',
        'target-arrow-color': '#94a3b8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'text-rotation': 'autorotate'
      }
    }
  ];

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
            <div className="w-full h-[600px] border border-gray-200 rounded-lg">
              <CytoscapeComponent
                elements={elements}
                layout={layout}
                stylesheet={stylesheet}
                style={{ width: '100%', height: '100%' }}
                cy={(cy) => { cyRef.current = cy; }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}