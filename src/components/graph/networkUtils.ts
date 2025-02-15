
export const createNetworkOptions = () => ({
  nodes: {
    shape: 'dot',
    size: 16,
    font: {
      size: 14,
      color: '#4A4036'
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
    color: '#E38C40',
    width: 2,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 1
      }
    },
    font: {
      size: 12,
      color: '#4A4036',
      align: 'middle'
    }
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18
    },
    stabilization: {
      enabled: true,
      iterations: 1000
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 300
  }
});
