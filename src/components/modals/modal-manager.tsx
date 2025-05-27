import React from "react";
import type { ModalData } from "../../types/flow.types";
import {
  InputModal,
  OutputModal,
  ConditionModal,
  BaseModal,
  ApprovalModal,
  ConditionBranchModal,
  EmailModal,
  ApprovalAndSignModals,
  TeamApprovalModal,
  GeneratePDFModal,
} from "../../atom";

interface ModalManagerProps {
  modalData: ModalData | null;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
}

const ModalManager: React.FC<ModalManagerProps> = ({
  modalData,
  onClose,
  onSave,
}) => {
  if (!modalData) return null;

  const handleSave = (data: any) => {
    onSave(modalData.nodeId, data);
  };

  const renderModal = () => {
    switch (modalData.nodeType) {
      case "condition":
        return (
          <ConditionModal
            open={true}
            onCancel={onClose}
            onOk={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "branch":
        return (
          <ConditionBranchModal
            open={true}
            onOk={handleSave}
            onCancel={onClose}
            initialData={modalData.currentData}
            closable={true}
          />
        );
      case "input":
        return (
          <InputModal
            isOpen={true}
            onClose={onClose}
            onSave={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "default":
        return (
          <BaseModal
            isOpen={true}
            onClose={onClose}
            title="Configure Process Node"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Process node configuration coming soon...
              </p>
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </BaseModal>
        );
      case "output":
        return (
          <OutputModal
            isOpen={true}
            onClose={onClose}
            onSave={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "email":
        return (
          <EmailModal
            isOpen={true}
            onClose={onClose}
            onSave={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "approval":
        return (
          <ApprovalModal
            open={true}
            onCancel={onClose}
            onOk={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "sign":
        return (
          <ApprovalAndSignModals
            isOpen={true}
            onClose={onClose}
            onSave={handleSave}
            initialData={modalData.currentData}
          />
        );
      case "teamApproval":
        return (
          <TeamApprovalModal
            isOpen={true}
            onClose={onClose}
            onSave={handleSave}
            initialData={modalData.currentData}
            onGeneratePDF={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        );
      case "pdf":
        return (
          <GeneratePDFModal
            isOpen={true}
            onClose={onClose}
            nodeData={{
              teamMembers: [],
              description: undefined,
              outcomes: {
                approve: "",
                deny: "",
              },
            }}
          />
        );
      default:
        return null;
    }
  };
  return renderModal();
};

export { ModalManager };
