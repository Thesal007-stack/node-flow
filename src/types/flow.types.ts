// types/flow.types.ts
import type { LucideIcon } from "lucide-react";

export type NodeType =
  | "input"
  | "default"
  | "output"
  | "approval"
  | "email"
  | "sign"
  | "teamApproval";
export type LogicType = "condition" | "branch" |  "pdf";
export type FlowNodeType = NodeType | LogicType;
export interface NodeConfig {
  type: FlowNodeType;
  label: string;
  bgColor: string;
  textColor: string;
  hoverBgColor: string;
  icon: LucideIcon;
  iconColor: string;
  description: string;
  hasModal?: boolean;
}

export interface ModalData {
  nodeId: string;
  nodeType: FlowNodeType;
  currentData?: any;
}
export interface DragItemProps {
  nodeType: FlowNodeType;
  children: React.ReactNode;
}

export interface FlowStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<NodeType, number>;
}
