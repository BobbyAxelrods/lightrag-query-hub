
import { Network } from "vis-network";

export interface NetworkNode {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface NetworkEdge {
  from: string;
  to: string;
  label: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface NetworkInstance extends Network {
  body: {
    data: {
      nodes: any;
      edges: any;
    };
  };
}
