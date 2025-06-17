export interface IGraphFlow {
  id: number;
  nodeId: number;
  nodeType: string;
  methodName: string;
  providerMethodId: number;
  inputValues: string[];
  adaptorId: number;
  index: number;
  outputName: string;
  createdAt: string;
  updatedAt: string;
}

export interface IADCSItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  coreLLM: string;
  staticContext: string;
  nodesDefinition: Record<string, string>;
  graphFlow: IGraphFlow[];
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  category: string;
  outputType: string;
  outputTypeId: number;
  categoryId: number;
  requestCount: number;
}
