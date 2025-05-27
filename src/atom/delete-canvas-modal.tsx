import { Modal, Button } from "antd";
import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteCanvasModalProps {
  open: boolean;
  onConfirm: () => Promise<void> | void; // Support async onConfirm
  onCancel: () => void;
  closable?: boolean; // Optional closable prop
}

const DeleteCanvasModal: React.FC<DeleteCanvasModalProps> = ({
  open,
  onConfirm,
  onCancel,
  closable = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleConfirm}
      onCancel={onCancel}
      centered
      width={400}
      className="rounded-lg shadow-xl"
      styles={{
        body: { padding: "24px", background: "#fafafa" },
        header: { borderBottom: "1px solid #e5e7eb", padding: "16px 24px" },
      }}
      title={
        <div className="flex items-center gap-3">
          <AlertTriangle size={24} className="text-red-500" />
          <span className="text-lg font-semibold text-gray-900">
            Clear Canvas
          </span>
        </div>
      }
      closable={closable}
      closeIcon={
        closable ? (
          <X
            size={20}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          />
        ) : undefined
      }
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          aria-label="Cancel clear canvas"
        >
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleConfirm}
          loading={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label="Confirm clear canvas"
        >
          Yes, Clear
        </Button>,
      ]}
    >
      <div className="space-y-4 text-gray-600">
        <p className="text-sm">
          Are you sure you want to clear the canvas? This action cannot be
          undone.
        </p>
        <p className="text-sm text-gray-500">
          All nodes and connections will be permanently removed.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteCanvasModal;
