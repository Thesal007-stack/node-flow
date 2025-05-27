import type { NodeProps, EdgeProps } from "reactflow";

export interface CustomNodeData {
  label?: string;
  title?: string;
  description?: string;
  status?: string;
}

export interface CustomEdgeData {
  label?: string;
  description?: string;
}

export type CustomNodeProps = NodeProps<CustomNodeData>;
export type CustomEdgeProps = EdgeProps<CustomEdgeData>;
