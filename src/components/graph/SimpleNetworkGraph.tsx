
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

  useEffect(() => {
    if (!containerRef.current || !data || isInitializedRef.current) return;

    console.log("Initializing network with data:", data);

    const options = {
      nodes: {
        shape: 'dot',
        size: 35,
        font: {
          size: 14,
          color: '#333333',
          face: 'Inter',
          multi: true
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
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 }
        },
        font: {
          size: 12,
          align: 'middle'
        },
        color: { color: '#666666', opacity: 0.8 },
        smooth: {
          enabled: true,
          type: 'continuous'
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 200,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 0.5
        },
        stabilization: {
          enabled: true,
          iterations: 100,
          updateInterval: 25
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 300,
        hideEdgesOnDrag: true,
        navigationButtons: true
      }
    };

    networkRef.current = new Network(containerRef.current, { nodes: [], edges: [] }, options);
    
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

  useEffect(() => {
    if (!networkRef.current || !data) return;

    console.log("Updating network data:", data);

    const filteredNodes = data.nodes
      .filter(node => !hideIsolatedNodes || data.edges.some(edge => 
        edge.from === node.id || edge.to === node.id
      ))
      .map(node => ({
        id: node.id,
        label: showLabels ? node.label : '',
        title: node.label,
        value: node.properties.rank,
        color: {
          background: '#ffffff',
          border: '#E38C40',
          highlight: {
            background: '#F9B054',
            border: '#E38C40'
          }
        }
      }));

    const visEdges = data.edges.map(edge => ({
      from: edge.from,
      to: edge.to,
      label: showLabels ? edge.label : '',
      title: edge.label,
      value: edge.properties.weight,
      arrows: 'to',
      color: {
        color: '#666666',
        opacity: 0.8
      },
      smooth: {
        enabled: true,
        type: 'continuous'
      }
    }));

    console.log("Processed network data:", {
      nodes: filteredNodes,
      edges: visEdges
    });

    networkRef.current.setData({
      nodes: filteredNodes,
      edges: visEdges
    });

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
