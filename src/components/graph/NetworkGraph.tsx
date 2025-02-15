
import { useEffect, useRef, useCallback } from "react";
import { Network as VisNetwork } from "vis-network";
import { GraphData } from "./types";

interface NetworkGraphProps {
  graphData: GraphData;
  onNodeSelect: (node: any) => void;
}

export function NetworkGraph({ graphData, onNodeSelect }: NetworkGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkRef2 = useRef<VisNetwork | null>(null);

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
    const options = {
      nodes: {
        shape: 'dot',
        size: 25,
        font: {
          size: 14,
          color: '#333333'
        },
        borderWidth: 2,
        color: {
          background: '#ffffff',
          border: '#E38C40',
          highlight: {
            background: '#F9B054',
            border: '#E38C40'
          }
        }
      },
      edges: {
        font: {
          size: 12,
          align: 'middle'
        },
        color: '#666666',
        arrows: {
          to: { enabled: true, scaleFactor: 1 }
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based'
      }
    };

    try {
      const network = new VisNetwork(
        networkRef.current,
        data,
        options
      );

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

      networkRef2.current = network;
    } catch (err) {
      console.error('Error initializing network:', err);
    }
  }, [graphData, onNodeSelect]);

  useEffect(() => {
    if (networkRef2.current) {
      networkRef2.current.destroy();
      networkRef2.current = null;
    }

    initializeNetwork();

    return () => {
      if (networkRef2.current) {
        networkRef2.current.destroy();
        networkRef2.current = null;
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
