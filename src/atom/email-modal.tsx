import React, { useState, useEffect } from "react";
import { Form, Input, Button, Space, Typography, Tooltip, Collapse, message } from "antd";
import { Mail, Info } from "lucide-react";
import { BaseModal } from "./base-modal";
import { NODE_CONFIGURATIONS } from "../constants/node-configs";

const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { label: string; subject: string; recipients: string; body: string }) => void;
  initialData?: { label?: string; subject?: string; recipients?: string; body?: string };
}

export const EmailModal: React.FC<EmailModalProps> = ({
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
        label: initialData?.label || NODE_CONFIGURATIONS.email?.label || "Send Email",
        subject: initialData?.subject || "",
        recipients: initialData?.recipients || "",
        body: initialData?.body || "",
      });
    }
  }, [isOpen, initialData, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async
      onSave(values);
      form.resetFields();
      onClose();
      message.success("Email configuration saved successfully");
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
          <Mail
            size={20}
            className="text-purple-500 transition-transform duration-300 hover:scale-110"
          />
          <Text strong className="text-gray-800 text-lg">
            Configure Email Node
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
          name="label"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Node Label
              </Text>
              <Tooltip
                title="Enter a descriptive label for the email node"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: "Please enter a label" }]}
        >
          <Input
            placeholder="e.g., Send Approval Email"
            maxLength={50}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="subject"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Email Subject
              </Text>
              <Tooltip
                title="Enter the subject line for the email"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: "Please enter an email subject" }]}
        >
          <Input
            placeholder="e.g., Approval Request"
            maxLength={100}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="recipients"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Recipients
              </Text>
              <Tooltip
                title="Enter email addresses, separated by commas"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[
            { required: true, message: "Please enter recipient emails" },
            {
              type: "string",
              pattern: /^[\w\.-]+@[\w\.-]+\.\w+(,[\w\.-]+@[\w\.-]+\.\w+)*$/,
              message: "Enter valid email addresses, separated by commas",
            },
          ]}
        >
          <Input
            placeholder="e.g., hr@example.com, manager@example.com"
            maxLength={200}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

        <Form.Item
          name="body"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Email Body
              </Text>
              <Tooltip
                title="Write the content of the email"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Info size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: "Please enter the email body" }]}
        >
          <TextArea
            rows={4}
            placeholder="Write the email content here..."
            maxLength={1000}
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
                  Email Configuration Tips
                </Text>
              </Space>
            }
            key="1"
          >
            <div className="p-3 bg-blue-50 rounded-md">
              <Text className="text-gray-600 text-sm">
                Configure the email node effectively:
                <ul className="mt-2 space-y-1">
                  <li>• Use a clear label (e.g., "Send Approval Email").</li>
                  <li>• Include a concise, descriptive subject line.</li>
                  <li>• List multiple recipients with commas (e.g., user1@example.com, user2@example.com).</li>
                  <li>• Write a detailed but clear email body, avoiding excessive length.</li>
                </ul>
              </Text>
            </div>
          </Panel>
        </Collapse>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Cancel email configuration"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Save email configuration"
          >
            Save
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};