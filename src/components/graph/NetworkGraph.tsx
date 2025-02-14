
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

    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
      networkInstanceRef.current = null;
    }

    const nodes = graphData.nodes.map((node) => ({
      id: node.id,
      label: node.label || 'Unknown',
      title: JSON.stringify(node.properties, null, 2),
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

    const edges = graphData.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      label: edge.label || '',
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

    const data = { nodes, edges };
    const options = createNetworkOptions();

    try {
      networkInstanceRef.current = new VisNetwork(
        networkRef.current,
        data,
        options
      ) as NetworkInstance;

      networkInstanceRef.current.on('click', function(params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = graphData.nodes.find((n) => n.id === nodeId);
          if (node) {
            onNodeSelect(node);
          }
        }
      });

      networkInstanceRef.current.once('afterDrawing', function() {
        if (networkInstanceRef.current) {
          networkInstanceRef.current.fit();
        }
      });

      if (hideIsolatedNodes) {
        graphData.nodes.forEach((node) => {
          const connectedEdges = networkInstanceRef.current?.getConnectedEdges(node.id) || [];
          if (connectedEdges.length === 0) {
            networkInstanceRef.current?.body.data.nodes.update({
              id: node.id,
              hidden: true,
            });
          }
        });
      }
    } catch (err) {
      console.error('Error initializing network:', err);
    }
  }, [graphData, showLabels, hideIsolatedNodes, onNodeSelect]);

  return (
    <div ref={networkRef} className="w-full h-[600px] border border-gray-200 rounded-lg" />
  );
}
