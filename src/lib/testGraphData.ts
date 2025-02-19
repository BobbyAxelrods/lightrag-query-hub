
import { GraphData } from "@/components/graph/types";

export const testGraphData: GraphData = {
  nodes: [
    {
      id: "1",
      label: "Node A",
      properties: {
        type: "Entity",
        created: "2024-02-19"
      }
    },
    {
      id: "2",
      label: "Node B",
      properties: {
        type: "Entity",
        created: "2024-02-19"
      }
    },
    {
      id: "3",
      label: "Node C",
      properties: {
        type: "Dependency",
        weight: 0.8
      }
    }
  ],
  edges: [
    {
      from: "1",
      to: "2",
      label: "RELATES_TO",
      properties: {
        weight: 1,
        type: "relation"
      }
    },
    {
      from: "2",
      to: "3",
      label: "DEPENDS_ON",
      properties: {
        weight: 0.8,
        type: "dependency"
      }
    }
  ]
};
