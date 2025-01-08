import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';
import { getGraphAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CustomNode from "./graph/CustomNode";
import { GraphControls } from "./graph/GraphControls";
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

export function GraphVisualization() {
  const [showGraph, setShowGraph] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { toast } = useToast();

  const { data: graphData, isLoading } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraphAPI,
    enabled: showGraph,
    onSuccess: (data) => {
      // Process nodes with custom styling
      const processedNodes: Node[] = data.data.nodes.map((node: any) => ({
        id: node.id,
        type: 'custom',
        data: { label: node.label },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
      }));

      // Process edges with proper formatting
      const processedEdges: Edge[] = data.data.edges.map((edge: any, index: number) => ({
        id: `e${index}`,
        source: edge.source.replace(/"/g, ''),
        target: edge.target.replace(/"/g, ''),
        label: edge.label.replace(/"/g, ''),
        animated: true,
        style: { stroke: '#6366f1' },
      }));

      setNodes(processedNodes);
      setEdges(processedEdges);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load graph data",
        variant: "destructive",
      });
    },
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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!showGraph) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <GraphControls onToggleGraph={handleToggleGraph} showGraph={showGraph} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="h-[600px] bg-white rounded-xl shadow-xl p-4 animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <GraphControls onToggleGraph={handleToggleGraph} showGraph={showGraph} />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}