
export const createNetworkOptions = () => ({
  nodes: {
    borderWidth: 2,
    shadow: true
  },
  edges: {
    width: 2,
    shadow: true,
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0.5,
      forceDirection: 'none'
    }
  },
  physics: {
    enabled: true,
    stabilization: {
      iterations: 100,
      fit: true
    },
    barnesHut: {
      gravitationalConstant: -2000,
      springConstant: 0.04,
      springLength: 200
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    zoomView: true,
    dragView: true,
    navigationButtons: true,
    keyboard: true
  },
  height: '600px'
});
