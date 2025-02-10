
import { useEffect, useRef } from "react";
import { Network as VisNetwork } from "vis-network";
import { createNetworkOptions, createNodeData, createEdgeData } from "@/utils/networkConfig";

interface NetworkViewProps {
  graphData: any;
  showLabels: boolean;
  onNetworkInit: (network: VisNetwork) => void;
}

export function NetworkView({ graphData, showLabels, onNetworkInit }: NetworkViewProps) {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!networkRef.current || !graphData?.data) return;

    const nodes = graphData.data.nodes.map((node: any) => createNodeData(node, showLabels));
    const edges = graphData.data.edges.map((edge: any) => createEdgeData(edge));
    
    const network = new VisNetwork(
      networkRef.current,
      { nodes, edges },
      createNetworkOptions()
    );

    network.once('stabilizationIterationsDone', function() {
      network.fit();
    });

    onNetworkInit(network);

    return () => {
      network.destroy();
    };
  }, [graphData, showLabels, onNetworkInit]);

  return (
    <div ref={networkRef} className="w-full h-[600px] border border-gray-200 rounded-lg" />
  );
}
