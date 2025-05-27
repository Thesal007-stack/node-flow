import React from "react";
import { Modal } from "antd";

interface BaseModalProps {
  isOpen: boolean;
  styles?: Record<string, React.CSSProperties>;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  className,
  styles,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        title={title}
        width={width}
        styles={styles}
        className={className}
        centered
        destroyOnClose
      >
        {children}
      </Modal>
    </div>
  );
};
