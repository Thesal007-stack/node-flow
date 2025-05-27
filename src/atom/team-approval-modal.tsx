import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  Tooltip,
  Collapse,
  message,
} from "antd";
import { Users, Info, LucideAArrowDown } from "lucide-react";
import { BaseModal } from "./base-modal";

const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface TeamApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    teamMembers: string[];
    description?: string;
    outcomes: { approve: string; deny: string };
  }) => void;
  initialData?: {
    teamMembers?: string[];
    description?: string;
    outcomes?: { approve: string; deny: string };
  };
  onGeneratePDF: () => void;
}

const TeamApprovalModal: React.FC<TeamApprovalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  onGeneratePDF,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        teamMembers: initialData?.teamMembers?.join(", ") || "",
        description: initialData?.description || "",
      });
    }
  }, [isOpen, initialData, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const teamMembers = values.teamMembers
        .split(",")
        .map((email: string) => email.trim())
        .filter((email: string) => email);
      const data = {
        teamMembers,
        description: values.description,
        outcomes: { approve: "Approval", deny: "Deny" },
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(data);
      form.resetFields();
      onClose();
      message.success("Team approval configuration saved successfully");
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Please fill all required fields");
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
          <Users size={20} className="text-teal-500" />
          <Text strong className="text-gray-800 text-lg">
            Configure Team Approval Node
          </Text>
        </Space>
      }
      width={600}
      styles={{
        body: { padding: "24px", background: "#fafafa" },
        header: { borderBottom: "1px solid #e5e7eb", padding: "16px 24px" },
      }}
      className="rounded-lg shadow-xl"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-4"
      >
        <Form.Item
          name="teamMembers"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Team Members
              </Text>
              <Tooltip title="Enter team member email addresses, separated by commas">
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[
            {
              required: true,
              message: "Please enter at least one team member email",
            },
            {
              pattern: /^[\w\.-]+@[\w\.-]+\.\w+(,\s*[\w\.-]+@[\w\.-]+\.\w+)*$/,
              message: "Enter valid email addresses, separated by commas",
            },
          ]}
        >
          <Input
            placeholder="e.g., member1@example.com, member2@example.com"
            maxLength={200}
            showCount
            className="rounded-md"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Description (Optional)
              </Text>
              <Tooltip title="Describe the purpose of this team approval">
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
        >
          <TextArea
            rows={4}
            placeholder="e.g., Team approval for project budget"
            maxLength={500}
            showCount
            className="rounded-md"
          />
        </Form.Item>
        <div className="mb-4">
          <Text strong className="text-gray-700">
            Approval Outcomes
          </Text>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Text className="text-gray-600">Approve:</Text>
              <Text strong className="text-green-600">
                Approval
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text className="text-gray-600">Deny:</Text>
              <Text strong className="text-red-600">
                Deny
              </Text>
            </div>
          </div>
        </div>
        <Collapse
          defaultActiveKey={["1"]}
          className="mt-4"
          expandIconPosition="right"
          style={{
            background: "#ffffff",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Panel
            header={
              <Space>
                <Info size={16} className="text-blue-500" />
                <Text strong className="text-gray-700">
                  Team Approval Configuration Tips
                </Text>
              </Space>
            }
            key="1"
          >
            <div className="p-3 bg-blue-50 rounded-md">
              <Text className="text-gray-600 text-sm">
                Configure the team approval node effectively:
                <ul className="mt-2 space-y-1">
                  <li>
                    • List team members with commas (e.g., member1@example.com,
                    member2@example.com).
                  </li>
                  <li>• Ensure emails are valid to avoid workflow errors.</li>
                  <li>
                    • Add a description to clarify the approval’s purpose.
                  </li>
                  <li>
                    • Outcomes are fixed as “Approval” (Approve) and “Deny”
                    (Reject).
                  </li>
                </ul>
              </Text>
            </div>
          </Panel>
        </Collapse>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            aria-label="Cancel team approval configuration"
          >
            Cancel
          </Button>
          <Button
            onClick={onGeneratePDF}
            className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 border border-teal-300 rounded-md hover:bg-teal-200"
            aria-label="Generate PDF"
          >
            <Space>
              <LucideAArrowDown size={16} />
              Generate PDF
            </Space>
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            aria-label="Save team approval configuration"
          >
            Save
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export { TeamApprovalModal };
