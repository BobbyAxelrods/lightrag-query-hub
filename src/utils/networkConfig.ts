
import { Options } from "vis-network";

export const createNetworkOptions = (): Options => ({
  nodes: {
    shape: 'dot',
    size: 20,
    borderWidth: 2,
  },
  edges: {
    width: 2,
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0.5
    }
  },
  physics: {
    stabilization: true,
    barnesHut: {
      gravitationalConstant: -80000,
      springConstant: 0.001,
      springLength: 200
    }
  },
  interaction: {
    hover: true,
    zoomView: true,
    dragView: true,
  },
  height: '600px'
});

export const createNodeData = (node: any, showLabels: boolean) => ({
  id: node.id,
  label: node.label,
  color: {
    background: '#2563EB',
    border: '#1E40AF',
  },
  font: { size: showLabels ? 14 : 0 }
});

export const createEdgeData = (edge: any) => ({
  from: edge.source,
  to: edge.target,
  label: edge.label,
  arrows: 'to',
  color: { color: '#94A3B8' }
});
