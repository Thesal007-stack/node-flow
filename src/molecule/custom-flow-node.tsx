

import React from "react";
import { Handle, Position } from "reactflow";
import { NODE_CONFIGURATIONS } from "../constants/node-configs";
import { CirclePlus } from "lucide-react";

interface CustomFlowNodeProps {
  data: {
    label: string;
    type: string;
    branches?: { id: string; label: string }[];
    modalData?: any;
  };
}

const CustomFlowNode: React.FC<CustomFlowNodeProps> = ({ data }) => {
  const config =
    NODE_CONFIGURATIONS[data.type as keyof typeof NODE_CONFIGURATIONS];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${config.bgColor} ${config.textColor}`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <Icon size={20} className={config.iconColor} />
        <span className="font-medium">{data.label}</span>
      </div>
      {data.type === "branch" && data.branches && (
        <div className="mt-2 text-sm">
          {data.branches.map((branch) => (
            <p key={branch.id}>{branch.label}</p>
          ))}
        </div>
      )}
      {data.type === "output" && data.modalData && (
        <div className="mt-2 text-sm">
          <p>Destination: {data.modalData.destination}</p>
          <p>Format: {data.modalData.format}</p>
          {data.modalData.description && (
            <p>Description: {data.modalData.description}</p>
          )}
        </div>
      )}
      {data.type === "email" && data.modalData && (
        <div className="mt-2 text-sm">
          <p>Subject: {data.modalData.subject}</p>
          <p>Recipients: {data.modalData.recipients}</p>
          {data.modalData.body && (
            <p>
              Body: {data.modalData.body.substring(0, 50)}
              {data.modalData.body.length > 50 ? "..." : ""}
            </p>
          )}
        </div>
      )}
      {data.type === "approval" &&
        data.modalData &&
        data.modalData.approvers && (
          <div className="mt-2 text-sm">
            <p>Approvers: {data.modalData.approvers.join(", ")}</p>
            {data.modalData.description && (
              <p>Description: {data.modalData.description}</p>
            )}
          </div>
        )}
      {data.type === "sign" && data.modalData && (
        <div className="mt-2 text-sm">
          <p>Signer: {data.modalData.signer}</p>
          <p>Document: {data.modalData.document}</p>
          {data.modalData.dueDate && <p>Due Date: {data.modalData.dueDate}</p>}
        </div>
      )}
      {data.type === "teamApproval" &&
        data.modalData &&
        data.modalData.teamMembers && (
          <div className="mt-2 text-sm">
            <p>Team Members: {data.modalData.teamMembers.join(", ")}</p>
            {data.modalData.description && (
              <p>Description: {data.modalData.description}</p>
            )}
            {data.modalData.outcomes && (
              <div>
                <p>Approve: {data.modalData.outcomes.approve}</p>
                <p>Deny: {data.modalData.outcomes.deny}</p>
              </div>
            )}
          </div>
        )}
      {data.type === "branch" ? (
        data.branches?.map((branch, index) => (
          <Handle
            key={branch.id}
            type="source"
            position={Position.Right}
            id={branch.id}
            style={{ top: `${20 + index * 20}px` }}
          />
        ))
      ) : (
        <>
          <Handle type="source" position={Position.Bottom} id="a" />
          <Handle type="source" position={Position.Right} id="b" />
        </>
      )}
      
      {/* Add conditions box */}
      {config.hasModal && (
        <div className="border border-blue-300 bg-white/40 text-blue-600 rounded px-3 py-1.5 flex items-center justify-center gap-1 text-sm font-medium">
          <CirclePlus size={16} />
          <span >Add conditions</span>
        </div>
      )}
    </div>
  );
};

export { CustomFlowNode };
