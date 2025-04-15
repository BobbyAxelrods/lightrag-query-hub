
import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { GraphData } from './types';

interface SimpleNetworkGraphProps {
  data: GraphData;
  onNodeClick: (nodeId: string) => void;
}

export function SimpleNetworkGraph({ data, onNodeClick }: SimpleNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 14,
          color: '#333333',
        },
        borderWidth: 2,
        color: {
          background: '#ffffff',
          border: '#E38C40',
        }
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 }
        },
        color: { color: '#666666' }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
        },
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);
    networkRef.current.on('click', params => {
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
  }, [data, onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg bg-white"
    />
  );
}
