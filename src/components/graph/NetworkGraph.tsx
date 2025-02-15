
import { useEffect, useRef, useCallback } from "react";
import { Network as VisNetwork } from "vis-network";
import { GraphData } from "@/lib/api";
import { createNetworkOptions } from "./networkUtils";
import { NetworkInstance } from "./types";

interface NetworkGraphProps {
  graphData: GraphData;
  onNodeSelect: (node: any) => void;
}

export function NetworkGraph({ graphData, onNodeSelect }: NetworkGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<NetworkInstance | null>(null);

  const initializeNetwork = useCallback(() => {
    if (!networkRef.current || !graphData) return;

    // Create a map of nodes by ID for faster lookup
    const nodesMap = new Map(graphData.nodes.map(node => [node.id, node]));

    // Find connected nodes
    const connectedNodeIds = new Set();
    graphData.edges.forEach(edge => {
      connectedNodeIds.add(edge.from);
      connectedNodeIds.add(edge.to);
    });

    // Only include nodes that have connections
    const connectedNodes = graphData.nodes
      .filter(node => connectedNodeIds.has(node.id))
      .map(node => ({
        id: node.id,
        label: node.label,
        title: JSON.stringify(node.properties, null, 2),
      }));

    // Create edges for connected nodes
    const edges = graphData.edges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      label: edge.label
    }));

    const data = { nodes: connectedNodes, edges };
    const options = createNetworkOptions();

    try {
      const network = new VisNetwork(
        networkRef.current,
        data,
        options
      ) as NetworkInstance;

      // Handle node click
      network.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodesMap.get(nodeId);
          if (node) {
            onNodeSelect(node);
          }
        }
      });

      // Fit the network to the container
      network.once('stabilized', function() {
        network.fit();
      });

      networkInstanceRef.current = network;
    } catch (err) {
      console.error('Error initializing network:', err);
    }
  }, [graphData, onNodeSelect]);

  useEffect(() => {
    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    initializeNetwork();

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [initializeNetwork]);

  return (
    <div 
      ref={networkRef} 
      className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg bg-white/90 shadow-lg" 
    />
  );
}
