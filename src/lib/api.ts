import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export interface QueryRequest {
  query: string;
  mode: "local" | "global" | "hybrid";
}

export interface QueryResponse {
  status: string;
  data: any;
  message: string | null;
}

export const queryAPI = async (params: QueryRequest): Promise<QueryResponse> => {
  const response = await api.post("/query", params);
  return response.data;
};

export interface HealthResponse {
  status: string;
}

export interface Document {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  content: string;
}

export interface UploadResponse {
  status: string;
  message: string;
}

export const uploadFileAPI = async (file: File, uploadType: "initial" | "incremental"): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = uploadType === "initial" ? "/upload" : "/incremental-upload";
  const response = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteDocumentAPI = async (docId: string): Promise<QueryResponse> => {
  const response = await api.post("/delete_by_doc", { doc_id: docId });
  return response.data;
};

export const healthCheckAPI = async (): Promise<HealthResponse> => {
  const response = await api.get("/health");
  return response.data;
};

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

export const getGraphAPI = async (): Promise<GraphData> => {
  const response = await api.get("/get-graph");
  return response.data;
};

export const getDocumentsAPI = async (): Promise<QueryResponse> => {
  const response = await api.post("/get-document", {});
  return response.data;
};

interface EntityNode {
  id: string;
  entity: string;
  type: string;
  description: string;
  rank: number;
}

interface RelationEdge {
  id: string;
  source: string;
  target: string;
  description: string;
  weight: number;
  rank: number;
  created_at: string;
}

interface LocalGraphNode {
  id: string;
  entity: string;
  type: string;
  description: string;
  rank: string;
}

interface LocalGraphEdge {
  id: string;
  source: string;
  target: string;
  description: string;
  keywords: string;
  weight: string;
  rank: string;
  created_at: string;
}

interface LocalGraphData {
  nodes: LocalGraphNode[];
  edges: LocalGraphEdge[];
}

export const getGraphDataFromQuery = async (): Promise<GraphData> => {
  try {
    const response = await api.get("/graph_context");
    const data = response.data;

    if (!data.nodes || !data.edges) {
      throw new Error("Invalid graph data structure");
    }

    const nodes = data.nodes.map((node: LocalGraphNode) => ({
      id: node.id,
      label: node.entity || 'Unnamed Node',
      properties: {
        type: node.type || 'unknown',
        description: node.description || '',
      }
    }));

    const edges = data.edges.map((edge: LocalGraphEdge) => ({
      from: edge.source,
      to: edge.target,
      label: edge.description || '',
    }));

    return { nodes, edges };
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
};
