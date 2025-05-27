import React from "react";
import { DragItem } from "../atom/drag-item";
import { NODE_CONFIGURATIONS } from "../constants/node-configs";
import type { NodeType, LogicType } from "../types/flow.types";

export const NodePalette: React.FC = () => {
  const nodeTypes = (
    Object.keys(NODE_CONFIGURATIONS) as (NodeType | LogicType)[]
  ).filter((type): type is NodeType =>
    ["input", "default", "output", "approval", "email", "sign","teamApproval"].includes(type)
  );

  const logicTypes = (
    Object.keys(NODE_CONFIGURATIONS) as (NodeType | LogicType)[]
  ).filter((type): type is LogicType => ["condition", "branch", "pdf"].includes(type));

  return (
    <aside
      className="
        w-72 bg-white border border-gray-200 rounded-lg shadow-sm p-4
        flex flex-col
        max-h-[calc(100vh-80px)] overflow-hidden
      "
    >
      <div className="border-b border-gray-100 pb-3 mb-3 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800">Node Palette</h3>
        <p className="text-sm text-gray-600">Drag nodes to the canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar space-y-6 pr-1">
        <div className="space-y-3">
          {nodeTypes.map((nodeType) => {
            const config = NODE_CONFIGURATIONS[nodeType];
            const IconComponent = config.icon;

            return (
              <DragItem key={nodeType} nodeType={nodeType}>
                <div
                  className={`
                    p-4 rounded-lg cursor-move
                    transition-all duration-200 border border-transparent
                    ${config.bgColor} ${config.textColor} ${config.hoverBgColor}
                    hover:border-gray-300 hover:shadow-md hover:scale-105
                    active:scale-95
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg bg-white/50 ${config.iconColor}`}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{config.label}</h4>
                      <p className="text-xs opacity-75 mt-1 line-clamp-2">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>
              </DragItem>
            );
          })}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            Logic Element
          </h3>
          <div className="space-y-3 mt-2">
            {logicTypes.map((logicType) => {
              const config = NODE_CONFIGURATIONS[logicType];
              const IconComponent = config.icon;

              return (
                <div key={logicType}>
                  <DragItem nodeType={logicType}>
                    <div
                      className={`
                        p-4 rounded-lg cursor-pointer
                        transition-all duration-200 border border-transparent
                        ${config.bgColor} ${config.textColor} ${config.hoverBgColor}
                        hover:border-gray-300 hover:shadow-md hover:scale-105
                        active:scale-95
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-white/50 ${config.iconColor}`}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">
                            {config.label}
                          </h4>
                          <p className="text-xs opacity-75 mt-1 line-clamp-2">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DragItem>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-3 flex-shrink-0">
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p className="font-medium text-gray-700 mb-2">Quick Tips</p>
          <ul className="space-y-1">
            <li>• Drag nodes to canvas</li>
            <li>• Connect with handles</li>
            <li>• Double-click to edit</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
