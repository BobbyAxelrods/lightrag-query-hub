import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraphAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Network, Eye, EyeOff, Minimize2 } from "lucide-react";
import { Network as VisNetwork, Data, DataSet } from "vis-network";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NetworkInstance extends VisNetwork {
  body: {
    data: {
      nodes: DataSet<any>;
      edges: DataSet<any>;
    };
  };
}

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [hideIsolatedNodes, setHideIsolatedNodes] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<NetworkInstance | null>(null);

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
      const nodes = networkInstanceRef.current.body.data.nodes.getIds();
      nodes.forEach((nodeId) => {
        networkInstanceRef.current?.body.data.nodes.update({
          id: nodeId,
          font: { size: showLabels ? 0 : 14, color: "#000000" },
        });
      });
    }
  };

  const handleToggleIsolatedNodes = () => {
    setHideIsolatedNodes(!hideIsolatedNodes);
    if (networkInstanceRef.current && graphData) {
      const network = networkInstanceRef.current;
      
      graphData.data.nodes.forEach((node: any) => {
        const connectedEdges = network.getConnectedEdges(node.id);
        if (connectedEdges.length === 0) {
          network.body.data.nodes.update({
            id: node.id,
            hidden: !hideIsolatedNodes,
          });
        }
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

    console.log("Graph Data:", graphData.data);

    const nodes = graphData.data.nodes.map((node: any) => ({
      id: node.id,
      label: node.entity_type?.replace(/"/g, '') || node.label?.replace(/"/g, '') || 'Unknown',
      title: node.description?.replace(/"/g, '') || node.properties?.replace(/"/g, '') || '',
      color: {
        background: '#2563EB',
        border: '#1E40AF',
        highlight: { background: '#3B82F6', border: '#1E40AF' }
      },
      font: { 
        color: '#000000', 
        size: showLabels ? 14 : 0 
      },
      shape: 'dot',
      size: 20
    }));

    const edges = graphData.data.edges.map((edge: any) => ({
      from: edge.start_id || edge.source,
      to: edge.end_id || edge.target,
      label: edge.description?.replace(/"/g, '') || '',
      arrows: {
        to: {
          enabled: true,
          type: 'arrow',
          scaleFactor: 1.5,
          color: '#64748B'
        }
      },
      color: { 
        color: '#94A3B8', 
        highlight: '#64748B',
        opacity: 1.0
      },
      font: { 
        size: 12, 
        align: 'middle',
        color: '#475569'
      },
      length: 250,
      width: 2,
      smooth: {
        enabled: true,
        type: 'continuous',
        roundness: 0.5,
        forceDirection: 'none'
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
      ) as NetworkInstance;

      networkInstanceRef.current.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graphData.data.nodes.find((n: any) => n.id === nodeId);
          if (node) {
            setSelectedNode(node);
            setIsDetailsOpen(true);
          }
        }
      });

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

  }, [graphData, isLoading, toast, showLabels]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={handleToggleGraph}
          className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Network className="mr-2 h-4 w-4" />
          {showGraph ? "Hide Network Graph" : "Show Network Graph"}
        </Button>

        {showGraph && (
          <>
            <Button
              onClick={handleToggleLabels}
              variant="outline"
              className="shadow-sm"
            >
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

            <Button
              onClick={handleToggleIsolatedNodes}
              variant="outline"
              className="shadow-sm"
            >
              <Minimize2 className="mr-2 h-4 w-4" />
              {hideIsolatedNodes ? "Show All Nodes" : "Hide Isolated Nodes"}
            </Button>
          </>
        )}
      </div>

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

      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Node Details</SheetTitle>
            <SheetDescription>
              {selectedNode && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Entity Type</h3>
                    <p>{selectedNode.entity_type?.replace(/"/g, '')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-gray-600">
                      {selectedNode.description?.replace(/"/g, '').split('<SEP>').map((desc: string, index: number) => (
                        <span key={index} className="block mb-2">{desc}</span>
                      ))}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Source ID</h3>
                    <p className="text-sm text-gray-600">
                      {selectedNode.source_id?.split('<SEP>').map((source: string, index: number) => (
                        <span key={index} className="block mb-1">{source}</span>
                      ))}
                    </p>
                  </div>
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}