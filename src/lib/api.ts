import axios from "axios";
import neo4j from 'neo4j-driver';

// Neo4j connection configuration
const driver = neo4j.driver(
  'bolt://localhost:7687',  // Replace with your Neo4j server URL
  neo4j.auth.basic('neo4j', 'your-password')  // Replace with your credentials
);

const api = axios.create({
  baseURL: "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add interceptor to log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export interface QueryRequest {
  query: string;
  mode: "hybrid" | "semantic" | "keyword";
  only_need_context: boolean;
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

export const queryAPI = async (params: QueryRequest): Promise<QueryResponse> => {
  const response = await api.post("/query", params);
  return response.data;
};

export const uploadFileAPI = async (file: File, uploadType: "initial" | "incremental") => {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = uploadType === "initial" ? "/upload" : "/incremental-upload";
  const response = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  const session = driver.session();
  try {
    // Replace this query with your specific Neo4j query
    const result = await session.run(
      'MATCH (n)-[r]->(m) RETURN n, r, m'
    );

    // Transform Neo4j result into the expected GraphData format
    const nodes = new Set();
    const edges = [];
    
    result.records.forEach(record => {
      // Add start node
      const startNode = record.get('n');
      nodes.add({
        id: startNode.identity.toString(),
        label: startNode.labels[0] || 'Node',
        properties: startNode.properties
      });

      // Add end node
      const endNode = record.get('m');
      nodes.add({
        id: endNode.identity.toString(),
        label: endNode.labels[0] || 'Node',
        properties: endNode.properties
      });

      // Add relationship
      const rel = record.get('r');
      edges.push({
        source: rel.startNodeIdentity.toString(),
        target: rel.endNodeIdentity.toString(),
        label: rel.type
      });
    });

    return {
      status: "success",
      data: {
        nodes: Array.from(nodes),
        edges: edges
      },
      message: null
    };
  } catch (error) {
    console.error("Neo4j Query Error:", error);
    throw error;
  } finally {
    await session.close();
  }
};

export const getDocumentsAPI = async (): Promise<QueryResponse> => {
  const response = await api.get("/documents");
  return response.data;
};

// Clean up Neo4j connection when the application closes
window.addEventListener('beforeunload', () => {
  driver.close();
});
