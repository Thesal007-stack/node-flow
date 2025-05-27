import { NODE_CONFIGURATIONS } from '../constants/node-configs';
import type { NodeType } from '../types/flow.types';

let nodeIdCounter = 0;

export const generateNodeId = (): string => `node_${++nodeIdCounter}`;

export const createNode = (type: NodeType, position: { x: number; y: number }) => ({
  id: generateNodeId(),
  type: 'custom', // Use custom node type for all nodes
  position,
  data: { 
    label: `${NODE_CONFIGURATIONS[type].label}`,
    description:`${ NODE_CONFIGURATIONS[type].description}`,
    type: type // Store the original type in data
  },
});

export const validateNodeType = (type: string): type is NodeType => {
  return ['input', 'default', 'output','approval','condition', 'branch', 'email', 'sign','teamApproval', 'pdf'].includes(type);
};
