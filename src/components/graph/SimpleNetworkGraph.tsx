
import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { GraphData } from "./types";

interface SimpleNetworkGraphProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

export function SimpleNetworkGraph({ data, onNodeClick }: SimpleNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Prepare the visualization data
    const nodes = data.nodes.map(node => ({
      id: node.id,
      label: node.label,
      title: Object.entries(node.properties)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    }));

    const edges = data.edges.map(edge => ({
      from: edge.from,
      to: edge.to,
      label: edge.label
    }));

    // Configuration options
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
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -26,
          springLength: 200,
          springConstant: 0.18
        },
        stabilization: {
          enabled: true,
          iterations: 200
        }
      }
    };

    // Create network
    const network = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );

    // Add click event handler
    if (onNodeClick) {
      network.on('click', (params) => {
        if (params.nodes.length > 0) {
          onNodeClick(params.nodes[0]);
        }
      });
    }

    return () => {
      network.destroy();
    };
  }, [data, onNodeClick]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] border border-gray-200 rounded-lg bg-white shadow-sm"
    />
  );
}
