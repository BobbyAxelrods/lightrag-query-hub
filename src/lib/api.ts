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
  stream?: boolean;
  only_need_context?: boolean;
}

export interface QueryResponse {
  status: string;
  data: any;
  message: string | null;
}

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

export const queryAPI = async (params: QueryRequest, onChunk?: (chunk: string) => void): Promise<void> => {
  try {
    const endpoint = params.stream ? "/query_stream" : "/query";
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (params.stream) {
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = decoder.decode(value);
        if (onChunk) {
          onChunk(chunk);
        }
      }
    } else {
      const data = await response.json();
      if (onChunk) {
        onChunk(data.response || data.message || "");
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

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

export const getGraphDataFromQuery = async (query: string): Promise<GraphData> => {
  try {
    const response = await api.post("/get-graph-data", { query });
    const data = response.data;
    
    // Transform the API response into GraphData format
    return {
      nodes: data.entities.map((entity: EntityNode) => ({
        id: entity.id,
        label: entity.entity,
        properties: {
          type: entity.type,
          description: entity.description,
          rank: entity.rank,
          content: entity.description
        }
      })),
      edges: data.relations.map((relation: RelationEdge) => ({
        from: relation.source,
        to: relation.target,
        label: relation.description,
        properties: {
          weight: relation.weight,
          rank: relation.rank,
          created_at: relation.created_at
        }
      }))
    };
  } catch (error) {
    console.error("Failed to fetch graph data:", error);
    throw error;
  }
};
