
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
        mass: 3, // Heavier nodes for more stability
        color: {
          background: '#ffffff',
          border: '#E38C40',
          highlight: {
            background: '#F9B054',
            border: '#E38C40'
          }
        }
      }));

    const visData = {
      nodes: filteredNodes,
      edges: data.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        label: showLabels ? edge.label : '',
        length: 200, // Increase edge length for better spacing
        width: 1, // Thinner edges
        color: {
          color: '#666666',
          opacity: 0.5 // Make edges more transparent
        }
      }))
    };

    const options = {
      nodes: {
        shape: 'dot',
        size: 16, // Smaller nodes
        font: {
          size: 14,
          color: '#333333',
          face: 'Inter'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          size: 5,
          x: 2,
          y: 2
        }
      },
      edges: {
        font: {
          size: 12,
          align: 'middle'
        },
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 }
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5
        },
        width: 1
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50, // Stronger repulsion
          centralGravity: 0.01, // Less central pull
          springLength: 200, // Longer springs
          springConstant: 0.08, // Softer springs
          damping: 0.4, // More damping
          avoidOverlap: 0.5 // Stronger overlap avoidance
        },
        stabilization: {
          enabled: true,
          iterations: 200,
          updateInterval: 25,
          fit: true
        }
      },
      layout: {
        improvedLayout: true,
        hierarchical: false
      },
      interaction: {
        hover: true,
        hideEdgesOnDrag: true,
        navigationButtons: false,
        keyboard: false,
        multiselect: false,
        dragNodes: true,
        dragView: true,
        zoomView: true
      }
    };

    networkRef.current = new Network(containerRef.current, visData, options);

    networkRef.current.on('click', function(params) {
      if (params.nodes.length > 0) {
        onNodeClick(params.nodes[0]);
      }
    });

    // Stabilize and then adjust physics
    networkRef.current.once('stabilized', function() {
      networkRef.current?.setOptions({ 
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -100,
            centralGravity: 0.005,
            springLength: 200,
            springConstant: 0.04
          }
        }
      });
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
      className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg bg-white"
    />
  );
}
