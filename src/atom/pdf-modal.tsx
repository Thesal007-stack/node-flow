import React, { useState } from "react";
import { Button, Space, Typography, message, Spin } from "antd";
import { LucideDatabase, Download } from "lucide-react";
import { BaseModal } from "./base-modal";

const { Text, Title } = Typography;

interface GeneratePDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    teamMembers: string[];
    description?: string;
    outcomes: { approve: string; deny: string };
  };
}

const GeneratePDFModal: React.FC<GeneratePDFModalProps> = ({
  isOpen,
  onClose,
  nodeData,
}) => {
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      // Simulate PDF generation (actual LaTeX compilation handled by backend/renderer)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(
        "PDF generated successfully! Download will start shortly."
      );
      // Trigger download (placeholder for actual PDF blob)
      const blob = new Blob(["PDF content placeholder"], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TeamApprovalConfig.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error("PDF generation failed:", error);
      message.error("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Space align="center">
          <LucideDatabase size={20} className="text-teal-500" />
          <Text strong className="text-gray-800 text-lg">
            Generate PDF Configuration
          </Text>
        </Space>
      }
      width={500}
      styles={{
        body: { padding: "24px", background: "#fafafa" },
        header: { borderBottom: "1px solid #e5e7eb", padding: "16px 24px" },
      }}
      className="rounded-lg shadow-xl"
    >
      <Spin spinning={loading}>
        <div className="space-y-4">
          <Title level={5} className="text-gray-800">
            Team Approval Configuration Preview
          </Title>
          <div className="p-4 bg-white rounded-md border border-gray-200">
            <Text strong className="text-gray-700">
              Team Members:
            </Text>
            <p className="text-gray-600">
              {nodeData.teamMembers.length > 0
                ? nodeData.teamMembers.join(", ")
                : "No team members specified"}
            </p>
            <Text strong className="text-gray-700 mt-2 block">
              Description:
            </Text>
            <p className="text-gray-600">
              {nodeData.description || "No description provided"}
            </p>
            <Text strong className="text-gray-700 mt-2 block">
              Outcomes:
            </Text>
            <p className="text-gray-600">
              Approve: {nodeData.outcomes.approve}
            </p>
            <p className="text-gray-600">Deny: {nodeData.outcomes.deny}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              aria-label="Cancel PDF generation"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleGeneratePDF}
              loading={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700"
              aria-label="Generate and download PDF"
            >
              <Space>
                <Download size={16} />
                Generate PDF
              </Space>
            </Button>
          </div>
        </div>
      </Spin>
    </BaseModal>
  );
};
export { GeneratePDFModal };
