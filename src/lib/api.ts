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

export interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    properties: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    label: string;
  }>;
}

export interface GraphResponse {
  status: string;
  data: GraphData;
  message: string | null;
}

export const getGraphAPI = async (): Promise<GraphResponse> => {
  const response = await api.get("/neo4j/graph");
  return response.data;
};

export const getDocumentsAPI = async (): Promise<QueryResponse> => {
  const response = await api.post("/get-document", {});
  return response.data;
};
