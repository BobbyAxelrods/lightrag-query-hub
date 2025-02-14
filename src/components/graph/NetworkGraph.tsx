
import { useEffect, useRef } from "react";
import { Network as VisNetwork } from "vis-network";
import { GraphData } from "@/lib/api";
import { createNetworkOptions } from "./networkUtils";
import { NetworkInstance } from "./types";

interface NetworkGraphProps {
  graphData: GraphData;
  showLabels: boolean;
  hideIsolatedNodes: boolean;
  onNodeSelect: (node: any) => void;
}

export function NetworkGraph({
  graphData,
  showLabels,
  hideIsolatedNodes,
  onNodeSelect,
}: NetworkGraphProps) {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<NetworkInstance | null>(null);

  useEffect(() => {
    if (!networkRef.current || !graphData) return;

    // Cleanup previous network instance
    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    // Create a map of nodes by ID for faster lookup
    const nodesMap = new Map(graphData.nodes.map(node => [node.id, node]));

    const nodes = graphData.nodes.map((node) => ({
      id: node.id,
      label: node.label || String(node.id),
      title: JSON.stringify(node.properties, null, 2),
      color: {
        background: '#E38C40',
        border: '#F9B054',
        highlight: { background: '#F9B054', border: '#E38C40' }
      },
      font: { 
        color: '#4A4036', 
        size: showLabels ? 14 : 0 
      },
      shape: 'dot',
      size: 20
    }));

    // Filter out edges that don't have valid source and target nodes
    const validEdges = graphData.edges.filter(edge => 
      nodesMap.has(edge.from) && nodesMap.has(edge.to)
    );

    const edges = validEdges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      label: edge.label || '',
      arrows: {
        to: {
          enabled: true,
          type: 'arrow',
          scaleFactor: 1.5,
          color: '#4A4036'
        }
      },
      color: { 
        color: '#E38C40', 
        highlight: '#F9B054',
        opacity: 1.0
      },
      font: { 
        size: 12, 
        align: 'middle',
        color: '#4A4036'
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

    const data = { nodes, edges };
    const options = createNetworkOptions();

    try {
      const network = new VisNetwork(
        networkRef.current,
        data,
        options
      ) as NetworkInstance;

      networkInstanceRef.current = network;

      network.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodesMap.get(nodeId);
          if (node) {
            onNodeSelect(node);
          }
        }
      });

      network.once('afterDrawing', function() {
        network.fit();
      });

      if (hideIsolatedNodes) {
        const connectedNodeIds = new Set();
        edges.forEach(edge => {
          connectedNodeIds.add(edge.from);
          connectedNodeIds.add(edge.to);
        });

        nodes.forEach(node => {
          if (!connectedNodeIds.has(node.id) && networkInstanceRef.current) {
            networkInstanceRef.current.body.data.nodes.update({
              id: node.id,
              hidden: true,
            });
          }
        });
      }
    } catch (err) {
      console.error('Error initializing network:', err);
    }

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [graphData, showLabels, hideIsolatedNodes, onNodeSelect]);

  return (
    <div ref={networkRef} className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg bg-[#F5F5F3]/50" />
  );
}
