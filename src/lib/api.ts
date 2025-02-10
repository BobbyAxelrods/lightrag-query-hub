import axios from "axios";
import neo4j from 'neo4j-driver';

// Neo4j connection configuration
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'prudential')
);

const api = axios.create({
  baseURL: "http://localhost:8000",
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
  mode: "global" | "local" | "hybrid";
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
  filename: string;
  size: number;
  lastModified: string;
  content: any;
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
  const session = driver.session({
    database: 'prudential'
  });
  try {
    // Simple query to get all nodes and relationships
    const result = await session.run(
      'MATCH (n)-[r]->(m) RETURN n, r, m'
    );

    const nodes = new Set<{
      id: string;
      label: string;
      properties: Record<string, any>;
    }>();
    const edges: Array<{
      source: string;
      target: string;
      label: string;
    }> = [];
    
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

    // Also get isolated nodes (nodes without relationships)
    const isolatedResult = await session.run(
      'MATCH (n) WHERE NOT (n)-[]-() RETURN n'
    );

    isolatedResult.records.forEach(record => {
      const node = record.get('n');
      nodes.add({
        id: node.identity.toString(),
        label: node.labels[0] || 'Node',
        properties: node.properties
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
  try {
    const response = await api.get("/documents/working-dir");
    return {
      status: "success",
      data: response.data,
      message: null
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Clean up Neo4j connection when the application closes
window.addEventListener('beforeunload', () => {
  driver.close();
});
