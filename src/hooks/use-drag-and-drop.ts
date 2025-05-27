import { useCallback, useRef } from 'react';
import type { ReactFlowInstance, XYPosition } from 'reactflow';
import { createNode, validateNodeType } from '../utils/node-utils';
import { DRAG_DATA_TRANSFER_KEY } from '../constants/node-configs';
import type { NodeType } from '../types/flow.types';

interface UseDragAndDropProps {
  reactFlowInstance: ReactFlowInstance | null;
  onNodeAdd: (node: any) => void;
}

export const useDragAndDrop = ({ reactFlowInstance, onNodeAdd }: UseDragAndDropProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.warn('ReactFlow instance or wrapper not available');
        return;
      }

      const nodeType = event.dataTransfer.getData(DRAG_DATA_TRANSFER_KEY);

      if (!validateNodeType(nodeType)) {
        console.warn(`Invalid node type: ${nodeType}`);
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position: XYPosition = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = createNode(nodeType as NodeType, position);
      onNodeAdd(newNode);
    },
    [reactFlowInstance, onNodeAdd]
  );

  return {
    reactFlowWrapper,
    handleDragOver,
    handleDrop,
  };
};
