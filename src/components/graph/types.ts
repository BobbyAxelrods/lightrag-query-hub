
export interface GraphNode {
  id: string;
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface LocalGraphNode {
  id: string;
  entity: string;
  type: string;
  description: string;
  rank: string;
}

export interface LocalGraphEdge {
  id: string;
  source: string;
  target: string;
  description: string;
  keywords: string;
  weight: string;
  rank: string;
  created_at: string;
}

export interface LocalGraphData {
  nodes: LocalGraphNode[];
  edges: LocalGraphEdge[];
}
