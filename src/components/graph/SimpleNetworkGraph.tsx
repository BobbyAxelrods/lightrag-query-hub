
import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { GraphData } from './types';
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface SimpleNetworkGraphProps {
  data: GraphData;
  onNodeClick: (nodeId: string) => void;
  showLabels?: boolean;
  hideIsolatedNodes?: boolean;
}

export function SimpleNetworkGraph({ 
  data, 
  onNodeClick, 
  showLabels = false,
  hideIsolatedNodes = true
}: SimpleNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const isInitializedRef = useRef(false);

  const handleResetView = () => {
    networkRef.current?.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  };

  // Initialize network only once
  useEffect(() => {
    if (!containerRef.current || !data || isInitializedRef.current) return;

    const options = {
      nodes: {
        shape: 'dot',
        size: 35,
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
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -30,
          centralGravity: 0.005,
          springLength: 250,
          springConstant: 0.04,
          damping: 0.8,
          avoidOverlap: 0.5
        },
        stabilization: {
          enabled: true,
          iterations: 100,
          updateInterval: 50,
          fit: true
        },
        timestep: 0.3
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

    networkRef.current = new Network(containerRef.current, {nodes: [], edges: []}, options);

    networkRef.current.on('click', function(params) {
      if (params.nodes.length > 0) {
        onNodeClick(params.nodes[0]);
      }
    });

    networkRef.current.once('stabilized', function() {
      networkRef.current?.fit();
    });

    isInitializedRef.current = true;

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // Update data separately
  useEffect(() => {
    if (!networkRef.current || !data) return;

    console.log('Updating graph data:', data); // Debug log

    const filteredNodes = data.nodes
      .filter(node => !hideIsolatedNodes || data.edges.some(edge => 
        edge.from === node.id || edge.to === node.id
      ))
      .map(node => ({
        id: node.id,
        label: showLabels ? node.label : '',
        title: JSON.stringify(node.properties, null, 2),
        mass: 4,
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
        length: 250,
        width: 1,
        color: {
          color: '#666666',
          opacity: 0.5
        }
      }))
    };

    console.log('Processed graph data:', visData); // Debug log
    networkRef.current.setData(visData);
    setTimeout(() => networkRef.current?.fit(), 50);
  }, [data, showLabels, hideIsolatedNodes]);

  return (
    <div className="relative">
      <Button
        onClick={handleResetView}
        className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-lg"
        variant="outline"
        size="sm"
      >
        <Maximize2 className="h-4 w-4 mr-2" />
        Reset View
      </Button>
      <div 
        ref={containerRef} 
        className="w-full h-[600px] border border-[#E38C40]/20 rounded-lg bg-white"
      />
    </div>
  );
}
