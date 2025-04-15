
import axios from "axios";
import { GraphNode, GraphEdge, GraphData } from "@/components/graph/types";

// Determine the API URL based on environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
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
  doc_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  content: string;
  content_summary?: string;
  chunks_count?: number;
}

export interface UploadResponse {
  status: string;
  message: string;
}

export type { GraphNode, GraphEdge, GraphData };

export const getGraphAPI = async (): Promise<GraphData> => {
  try {
    console.log("Fetching graph data from:", `${API_BASE_URL}/get-graph`);
    const response = await api.get("/get-graph");
    return response.data;
  } catch (error) {
    console.error("Get Graph API Error:", error);
    throw error;
  }
};

export const queryAPI = async (params: QueryRequest): Promise<QueryResponse> => {
  try {
    console.log("Sending query:", params);
    const response = await api.post("/query", params);
    console.log("Query response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Query API Error:", error);
    throw error;
  }
};

export const uploadFileAPI = async (file: File, uploadType: "initial" | "incremental"): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const endpoint = uploadType === "initial" ? "/upload" : "/incremental-upload";
    const response = await api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Upload API Error:", error);
    throw error;
  }
};

export const deleteDocumentAPI = async (docId: string): Promise<QueryResponse> => {
  try {
    const response = await api.post("/delete_by_doc", { doc_id: docId });
    return response.data;
  } catch (error) {
    console.error("Delete API Error:", error);
    throw error;
  }
};

export const healthCheckAPI = async (): Promise<HealthResponse> => {
  try {
    console.log("Checking health at:", `${API_BASE_URL}/health`);
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("Health Check API Error:", error);
    throw error;
  }
};

export const getDocumentsAPI = async (): Promise<QueryResponse> => {
  try {
    console.log("Fetching documents from:", `${API_BASE_URL}/get-document`);
    const response = await api.post("/get-document", {});
    console.log("Documents response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Documents API Error:", error);
    throw error;
  }
};
