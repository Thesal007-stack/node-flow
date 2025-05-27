import React, { useState } from "react";
import { Form, Radio, Button, Space, Typography, message } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { BaseModal } from "./base-modal";

const { Text } = Typography;

interface EdgeLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (label: string) => void;
}

export const EdgeLabelModal: React.FC<EdgeLabelModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async
      onSave(values.label);
      form.resetFields();
      onClose();
      message.success("Edge label saved successfully");
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Please select a label");
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
          <CheckCircle
            size={20}
            className="text-blue-500 transition-transform duration-300 hover:scale-110"
          />
          <Text strong className="text-gray-800 text-lg">
            Select Edge Label
          </Text>
        </Space>
      }
      width={400}
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
          label={<Text strong className="text-gray-700">Edge Label</Text>}
          rules={[{ required: true, message: "Please select a label" }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="Approval">
                <Space>
                  <CheckCircle size={16} className="text-green-500" />
                  <Text>Approval</Text>
                </Space>
              </Radio>
              <Radio value="Deny">
                <Space>
                  <XCircle size={16} className="text-red-500" />
                  <Text>Deny</Text>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Cancel edge label selection"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            aria-label="Save edge label"
          >
            Save
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};