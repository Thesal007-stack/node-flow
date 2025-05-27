
// hooks/useFlowStats.ts
import { useMemo } from 'react';
import type { Node, Edge } from 'reactflow';
import type { FlowStats, NodeType } from '../types/flow.types';

export const useFlowStats = (nodes: Node[], edges: Edge[]): FlowStats => {
  return useMemo(() => {
    const nodesByType = nodes.reduce((acc, node) => {
      const nodeType = node.type as NodeType;
      acc[nodeType] = (acc[nodeType] || 0) + 1;
      return acc;
    }, {} as Record<NodeType, number>);

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodesByType,
    };
  }, [nodes, edges]);
};
