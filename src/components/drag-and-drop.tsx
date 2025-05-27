import React, { useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  BackgroundVariant,
  type OnConnect,
  type Node,
  type Edge,
  type Connection,
  type ReactFlowInstance,
  MiniMap,
} from "reactflow";
import { NodePalette } from "../molecule/node-palette";
import { FlowStats } from "../atom/flow-stats";
import { ModalManager } from "./modals/modal-manager";
import { useDragAndDrop } from "../hooks/use-drag-and-drop";
import { useFlowStats } from "../hooks/use-flow-stats";
import type { FlowNodeType, ModalData, NodeType } from "../types/flow.types";
import { CustomFlowNode } from "../molecule/custom-flow-node";
import { EdgeLabelModal } from "../atom/edge-label-modal";
import "reactflow/dist/style.css";
import { Button } from "antd";
import DeleteCanvasModal from "../atom/delete-canvas-modal";

const nodeTypes = {
  custom: CustomFlowNode,
};

const INITIAL_NODES: Node[] = [
  {
    id: "welcome-node",
    type: "custom",
    data: {
      label: "Welcome! Start building...",
      type: "input",
    },
    position: { x: 250, y: 100 },
  },
];

const DragAndDropFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [edgeModalData, setEdgeModalData] = useState<{
    connection: Connection;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showDeleteModal = () => setIsDeleteModalOpen(true);
  const handleConfirmDelete = () => {
    setNodes([]);
    setEdges([]);
    setIsDeleteModalOpen(false);
  };
  const handleCancelDelete = () => setIsDeleteModalOpen(false);

  const stats = useFlowStats(nodes, edges);

  const handleNodeAdd = useCallback(
    (newNode: Node) => {
      setNodes((currentNodes) => [...currentNodes, newNode]);
    },
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (nodeId: string, nodeType: NodeType, currentData?: any) => {
      setModalData({
        nodeId,
        nodeType,
        currentData,
      });
    },
    []
  );

  const handleModalSave = useCallback(
    (nodeId: string, data: any) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  modalData: data,
                  label: data.source
                    ? `Input: ${data.source.toUpperCase()}`
                    : data.destination
                    ? `Output: ${data.destination.toUpperCase()}`
                    : data.approvers &&
                      Array.isArray(data.approvers) &&
                      node.data.type === "approval"
                    ? `Approval: ${data.approvers.join(", ").substring(0, 40)}${
                        data.approvers.join(", ").length > 40 ? "..." : ""
                      }`
                    : data.label && node.data.type === "email"
                    ? `Email: ${data.label.substring(0, 20)}...`
                    : data.signer && node.data.type === "sign"
                    ? `Sign: ${data.signer.substring(0, 20)}...`
                    : data.teamMembers &&
                      Array.isArray(data.teamMembers) &&
                      node.data.type === "teamApproval"
                    ? `Team Approval: ${data.teamMembers
                        .join(", ")
                        .substring(0, 40)}${
                        data.teamMembers.join(", ").length > 40 ? "..." : ""
                      }`
                    : data.description
                    ? `${
                        node.data.type.charAt(0).toUpperCase() +
                        node.data.type.slice(1)
                      }: ${data.description.substring(0, 20)}...`
                    : node.data.label,
                },
              }
            : node
        )
      );
      setModalData(null);
    },
    [setNodes]
  );

  const handleModalClose = useCallback(() => {
    setModalData(null);
  }, []);

  const { reactFlowWrapper, handleDragOver, handleDrop } = useDragAndDrop({
    reactFlowInstance,
    onNodeAdd: handleNodeAdd,
  });

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        console.log("Invalid connection: source or target is null");
        return;
      }
      const sourceNode = nodes.find((node) => node.id === connection.source);
      if (sourceNode?.data.type === "teamApproval") {
        setEdgeModalData({ connection });
      } else {
        const newEdge: Edge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          label: "",
        };
        setEdges((currentEdges) => addEdge(newEdge, currentEdges));
      }
    },
    [nodes, setEdges]
  );

  const handleEdgeLabelSave = useCallback(
    (label: string) => {
      if (!edgeModalData) return;
      const { connection } = edgeModalData;
      if (!connection.source || !connection.target) {
        console.log("Invalid connection: source or target is null");
        return;
      }
      const newEdge: Edge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
        label,
        labelStyle: {
          fill: label === "Approval" ? "#22c55e" : "#ef4444",
          fontWeight: 700,
        },
      };
      setEdges((currentEdges) => addEdge(newEdge, currentEdges));
      setEdgeModalData(null);
    },
    [edgeModalData, setEdges]
  );

  const nodeColor = useCallback((node: Node): string => {
    const nodeType = node.data.type as FlowNodeType;
    switch (nodeType) {
      case "input":
        return "#6ede87"; // Green
      case "output":
        return "#d1a4e8"; // Purple (fixed from '#ffff ')
      case "default":
        return "#ff0072"; // Pink
      case "approval":
        return "#ba2a5c"; // Reddish
      case "branch":
        return "#8b5cf6"; // Purple (updated from gray)
      case "email":
        return "#9333ea"; // Darker Purple
      case "sign":
        return "#4f46e5"; // Indigo
      case "teamApproval":
        return "#14b8a6"; // Teal
      default:
        return "#d3d3d3"; // Gray fallback
    }
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Flow Builder Studio
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create workflows by dragging nodes from the palette. Click nodes
              to configure them.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button type="primary" danger onClick={showDeleteModal}>
              Clear Canvas
            </Button>
            <Button type="primary">Export Flow</Button>
            <DeleteCanvasModal
              open={isDeleteModalOpen}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] gap-4 p-4">
        <NodePalette />

        {/* Canvas Container */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ReactFlowProvider>
            <div className="w-full h-full" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onInit={setReactFlowInstance}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onNodeClick={(_, node) =>
                  handleNodeClick(node.id, node.data.type, node.data.modalData)
                }
                nodeTypes={nodeTypes}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
                defaultEdgeOptions={{
                  animated: true,
                  style: { strokeWidth: 2 },
                }}
              >
                <MiniMap pannable zoomable nodeColor={nodeColor} />
                <Controls className="bg-white border border-gray-200 shadow-sm rounded-lg" />
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#e5e7eb"
                />

                {/* Statistics Panel */}
                <Panel position="top-right">
                  <FlowStats stats={stats} />
                </Panel>

                {/* Instructions Panel */}
                {nodes.length <= 1 && (
                  <Panel position="bottom-center">
                    <div className="bg-blue-50/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200 shadow-sm max-w-md">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                          Get Started
                        </h3>
                        <p className="text-xs text-blue-700">
                          Drag nodes from the left palette and drop them here to
                          build your workflow. Click on nodes to configure them,
                          then connect nodes by dragging from the handles.
                        </p>
                      </div>
                    </div>
                  </Panel>
                )}
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Modal Manager */}
      <ModalManager
        modalData={modalData}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
      <EdgeLabelModal
        isOpen={!!edgeModalData}
        onClose={() => setEdgeModalData(null)}
        onSave={handleEdgeLabelSave}
      />
    </div>
  );
};

export { DragAndDropFlow };
