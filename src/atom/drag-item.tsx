import React from 'react';
import type { DragItemProps } from '../types/flow.types';
import { DRAG_DATA_TRANSFER_KEY } from '../constants/node-configs';

export const DragItem: React.FC<DragItemProps> = ({ nodeType, children }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData(DRAG_DATA_TRANSFER_KEY, nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="select-none"
      onDragStart={handleDragStart}
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Drag ${nodeType} node`}
    >
      {children}
    </div>
  );
};