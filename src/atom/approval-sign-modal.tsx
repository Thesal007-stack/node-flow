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
import { UserCheck, Info } from "lucide-react";
import { BaseModal } from "./base-modal";

const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { approvers: string[]; description?: string }) => void;
  initialData?: { approvers?: string[]; description?: string };
}

const ApprovalAndSignModals: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        approvers: initialData?.approvers?.join(", ") || "",
        description: initialData?.description || "",
      });
    }
  }, [isOpen, initialData, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const approvers = values.approvers
        .split(",")
        .map((email: string) => email.trim())
        .filter((email: string) => email);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async
      onSave({ approvers, description: values.description });
      form.resetFields();
      onClose();
      message.success("Approval configuration saved successfully");
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
          <UserCheck
            size={20}
            className="text-orange-500 transition-transform duration-300 hover:scale-110"
          />
          <Text strong className="text-gray-800 text-lg">
            Configure Approval Node
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
          name="approvers"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Approvers
              </Text>
              <Tooltip
                title="Enter approver email addresses, separated by commas"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[
            {
              required: true,
              message: "Please enter at least one approver email",
            },
            {
              pattern: /^[\w\.-]+@[\w\.-]+\.\w+(,\s*[\w\.-]+@[\w\.-]+\.\w+)*$/,
              message: "Enter valid email addresses, separated by commas",
            },
          ]}
        >
          <Input
            placeholder="e.g., approver1@example.com, approver2@example.com"
            maxLength={200}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Description (Optional)
              </Text>
              <Tooltip
                title="Describe the purpose of this approval"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
        >
          <TextArea
            rows={4}
            placeholder="e.g., Requires manager approval for budget"
            maxLength={500}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

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
                  Approval Configuration Tips
                </Text>
              </Space>
            }
            key="1"
          >
            <div className="p-3 bg-blue-50 rounded-md">
              <Text className="text-gray-600 text-sm">
                Configure the approval node effectively:
                <ul className="mt-2 space-y-1">
                  <li>
                    • List multiple approvers with commas (e.g.,
                    user1@example.com, user2@example.com).
                  </li>
                  <li>• Ensure emails are valid to avoid workflow errors.</li>
                  <li>
                    • Add a description to clarify the approval’s purpose.
                  </li>
                </ul>
              </Text>
            </div>
          </Panel>
        </Collapse>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Cancel approval configuration"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Save approval configuration"
          >
            Save
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export { ApprovalAndSignModals };
