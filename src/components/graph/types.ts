
import { Network, DataSet } from "vis-network";

export interface NetworkInstance extends Network {
  body: {
    data: {
      nodes: DataSet<any>;
      edges: DataSet<any>;
    };
  };
}
