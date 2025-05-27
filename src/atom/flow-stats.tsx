import React from 'react';
import type { FlowStats as FlowStatsType } from '../types/flow.types';
import { NODE_CONFIGURATIONS } from '../constants/node-configs';

interface FlowStatsProps {
  stats: FlowStatsType;
}   

export const FlowStats: React.FC<FlowStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Flow Statistics</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Nodes:</span>
          <span className="text-sm font-medium text-gray-800">{stats.totalNodes}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Connections:</span>
          <span className="text-sm font-medium text-gray-800">{stats.totalEdges}</span>
        </div>

        {stats.totalNodes > 0 && (
          <>
            <hr className="my-2 border-gray-200" />
            <div className="text-xs text-gray-500 mb-1">By Type:</div>
            {Object.entries(stats.nodesByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-xs text-gray-600 capitalize">
                  {NODE_CONFIGURATIONS[type as keyof typeof NODE_CONFIGURATIONS]?.label || type}:
                </span>
                <span className="text-xs font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
