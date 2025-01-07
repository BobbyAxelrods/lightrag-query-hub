import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Update this with your actual API URL
});

export interface QueryRequest {
  query: string;
  mode: "hybrid" | "semantic" | "keyword";
  only_need_context: boolean;
}

export interface QueryResponse {
  status: string;
  data: string;
  message: string | null;
}

export interface HealthResponse {
  status: string;
}

export const queryAPI = async (params: QueryRequest): Promise<QueryResponse> => {
  const response = await api.post("/query", params);
  return response.data;
};

export const uploadFileAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/insert", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const healthCheckAPI = async (): Promise<HealthResponse> => {
  const response = await api.get("/health");
  return response.data;
};