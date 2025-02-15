
import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { GraphData } from './types';

interface SimpleNetworkGraphProps {
  data: GraphData;
  onNodeClick: (nodeId: string) => void;
  showLabels?: boolean;
  hideIsolatedNodes?: boolean;
}

export function SimpleNetworkGraph({ 
  data, 
  onNodeClick, 
  showLabels = true,
  hideIsolatedNodes = false 
}: SimpleNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Create a map of nodes by ID for faster lookup
    const nodesMap = new Map(data.nodes.map(node => [node.id, node]));

    // Find connected nodes
    const connectedNodeIds = new Set();
    data.edges.forEach(edge => {
      connectedNodeIds.add(edge.from);
      connectedNodeIds.add(edge.to);
    });

    // Filter nodes based on hideIsolatedNodes prop
    const filteredNodes = data.nodes
      .filter(node => !hideIsolatedNodes || connectedNodeIds.has(node.id))
      .map(node => ({
        id: node.id,
        label: showLabels ? node.label : '',
        title: JSON.stringify(node.properties, null, 2),
      }));

    const visData = {
      nodes: filteredNodes,
      edges: data.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        label: showLabels ? edge.label : '',
      }))
    };

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

    networkRef.current = new Network(containerRef.current, visData, options);

    networkRef.current.on('click', function(params) {
      if (params.nodes.length > 0) {
        onNodeClick(params.nodes[0]);
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data, onNodeClick, showLabels, hideIsolatedNodes]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg"
    />
  );
}
