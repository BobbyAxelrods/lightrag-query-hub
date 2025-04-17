import axios from "axios";
import { GraphNode, GraphEdge, GraphData } from "@/components/graph/types";

// Determine the API URL based on environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create a configurable axios instance with increased timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 300000, // 5 minutes timeout
});

// Enhanced error interceptor with detailed logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed information about the error
    console.error("API Error:", {
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
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
  } catch (error: any) {
    console.error("Query API Error:", {
      endpoint: "/query",
      parameters: params,
      error: error.response?.data || error.message
    });
    
    // Return a structured error response instead of throwing
    return {
      status: "error",
      data: null,
      message: error.response?.data?.message || 
              error.response?.statusText || 
              `Error ${error.response?.status || ''}: ${error.message}`
    };
  }
};

export const uploadFileAPI = async (files: File | File[], uploadType: "initial" | "incremental"): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      // Handle multiple files
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    } else {
      // Handle single file for backward compatibility
      formData.append("file", files);
    }

    const endpoint = uploadType === "initial" ? "/upload" : "/incremental-upload";
    const response = await api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000, // 5 minutes timeout specifically for uploads
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
