
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
        fixed: true, // Reduce physics calculations
        mass: 2, // Make nodes more stable
      }));

    const visData = {
      nodes: filteredNodes,
      edges: data.edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        label: showLabels ? edge.label : '',
        smooth: false, // Disable curve calculations
      }))
    };

    const options = {
      nodes: {
        shape: 'dot',
        size: 20, // Reduced size for better performance
        font: {
          size: 12, // Smaller font size
          color: '#333333'
        },
        borderWidth: 1, // Thinner borders
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
          size: 10, // Smaller font size
          align: 'middle'
        },
        color: '#666666',
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 } // Smaller arrows
        },
        smooth: false // Disable curved edges
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -20,
          centralGravity: 0.005,
          springLength: 100,
          springConstant: 0.05,
          avoidOverlap: 0.2
        },
        stabilization: {
          enabled: true,
          iterations: 100, // Reduced iterations
          updateInterval: 50,
          fit: true
        },
        timestep: 0.5, // Reduced timestep for smoother rendering
        adaptiveTimestep: true
      },
      interaction: {
        hideEdgesOnDrag: true, // Hide edges while dragging
        hideNodesOnDrag: false,
        hover: true,
        navigationButtons: false, // Disable navigation buttons
        keyboard: false, // Disable keyboard navigation
      }
    };

    networkRef.current = new Network(containerRef.current, visData, options);

    networkRef.current.on('click', function(params) {
      if (params.nodes.length > 0) {
        onNodeClick(params.nodes[0]);
      }
    });

    // Once the network is stabilized, reduce physics calculations
    networkRef.current.once('stabilized', function() {
      networkRef.current?.setOptions({ physics: { enabled: false } });
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
