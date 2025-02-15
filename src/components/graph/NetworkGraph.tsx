
import { useEffect, useRef, useCallback } from "react";
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

  const initializeNetwork = useCallback(() => {
    if (!networkRef.current || !graphData) return;

    // Create a map of nodes by ID for faster lookup
    const nodesMap = new Map(graphData.nodes.map(node => [node.id, node]));

    // Process nodes with their properties
    const nodes = graphData.nodes.map((node) => ({
      id: node.id,
      label: showLabels ? (node.label || String(node.id)) : '',
      title: JSON.stringify({
        id: node.id,
        label: node.label,
        ...node.properties
      }, null, 2),
      color: {
        background: '#00F0FF',
        border: '#00FF81',
        highlight: { background: '#00FF81', border: '#00F0FF' }
      },
      font: { 
        color: '#FFA900', 
        size: showLabels ? 14 : 0,
        face: 'arial'
      },
      shape: 'dot',
      size: 20,
      hidden: false, // Initially visible
      value: Object.keys(node.properties || {}).length // Node size based on property count
    }));

    // Filter out edges that don't have valid source and target nodes
    const validEdges = graphData.edges.filter(edge => 
      nodesMap.has(edge.from) && nodesMap.has(edge.to)
    );

    const edges = validEdges.map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      from: edge.from,
      to: edge.to,
      label: showLabels ? (edge.label || '') : '',
      arrows: {
        to: {
          enabled: true,
          type: 'arrow',
          scaleFactor: 1.5,
          color: '#FF6800'
        }
      },
      color: { 
        color: '#00F0FF', 
        highlight: '#00FF81',
        opacity: 0.8
      },
      font: { 
        size: 12, 
        align: 'middle',
        color: '#FFA900',
        face: 'arial'
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

      // Handle isolated nodes visibility
      if (hideIsolatedNodes) {
        const connectedNodeIds = new Set();
        edges.forEach(edge => {
          connectedNodeIds.add(edge.from);
          connectedNodeIds.add(edge.to);
        });

        nodes.forEach(node => {
          if (!connectedNodeIds.has(node.id)) {
            network.body.data.nodes.update({
              id: node.id,
              hidden: true,
            });
          } else {
            network.body.data.nodes.update({
              id: node.id,
              hidden: false,
            });
          }
        });
      } else {
        // Show all nodes when hideIsolatedNodes is false
        nodes.forEach(node => {
          network.body.data.nodes.update({
            id: node.id,
            hidden: false,
          });
        });
      }

      // Update label visibility when showLabels changes
      nodes.forEach(node => {
        network.body.data.nodes.update({
          id: node.id,
          label: showLabels ? (nodesMap.get(node.id)?.label || String(node.id)) : '',
          font: { 
            size: showLabels ? 14 : 0 
          }
        });
      });

      edges.forEach(edge => {
        network.body.data.edges.update({
          id: edge.id,
          label: showLabels ? edge.label : ''
        });
      });

      networkInstanceRef.current = network;
    } catch (err) {
      console.error('Error initializing network:', err);
    }
  }, [graphData, showLabels, hideIsolatedNodes, onNodeSelect]);

  useEffect(() => {
    // Cleanup previous network instance
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
    <div ref={networkRef} className="w-full h-[600px] border border-[#00FF81]/20 rounded-lg bg-gradient-to-br from-[#00F0FF]/5 to-[#FFA900]/5 backdrop-blur-sm" />
  );
}
