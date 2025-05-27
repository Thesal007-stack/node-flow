import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Space, Typography, Tooltip } from "antd";
import { Workflow, InfoIcon } from "lucide-react";
import { BaseModal } from "./base-modal";

const { Title, Text } = Typography;
const { Option } = Select;

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const InputModal: React.FC<InputModalProps> = ({
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
        source: initialData?.source || "api",
        url: initialData?.url || "",
        method: initialData?.method || "GET",
      });
    }
  }, [isOpen, initialData, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
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
          <Workflow
            size={20}
            className="text-green-600 transition-transform duration-300 hover:scale-110"
          />
          <Title level={4} className="mb-0 text-gray-800">
            Configure Input Source
          </Title>
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
          name="source"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Source Type
              </Text>
              <Tooltip
                title="Select the data source for this input node"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <InfoIcon size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: "Please select a source type" }]}
        >
          <Select
            placeholder="Select source type"
            className="rounded-md"
            style={{ height: "40px" }}
          >
            <Option value="api">API Endpoint</Option>
            <Option value="database">Database</Option>
            <Option value="file">File Upload</Option>
            <Option value="manual">Manual Input</Option>
          </Select>
        </Form.Item>

        {form.getFieldValue("source") === "api" && (
          <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
            <Form.Item
              name="url"
              label={
                <Space>
                  <Text strong className="text-gray-700">
                    API URL
                  </Text>
                  <Tooltip
                    title="Enter the full URL of the API endpoint"
                    color="#1e90ff"
                    overlayInnerStyle={{
                      borderRadius: "6px",
                      padding: "8px 12px",
                    }}
                  >
                    <InfoIcon
                      size={14}
                      className="text-blue-500 cursor-pointer"
                    />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: "Please enter the API URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input
                placeholder="https://api.example.com/data"
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                prefix={<span className="text-gray-400 mr-2">🌐</span>}
              />
            </Form.Item>

            <Form.Item
              name="method"
              label={
                <Space>
                  <Text strong className="text-gray-700">
                    HTTP Method
                  </Text>
                  <Tooltip
                    title="Select the HTTP method for the API request"
                    color="#1e90ff"
                    overlayInnerStyle={{
                      borderRadius: "6px",
                      padding: "8px 12px",
                    }}
                  >
                    <InfoIcon
                      size={14}
                      className="text-blue-500 cursor-pointer"
                    />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: "Please select an HTTP method" },
              ]}
            >
              <Select
                placeholder="Select HTTP method"
                className="rounded-md"
                style={{ height: "40px" }}
              >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
              </Select>
            </Form.Item>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};
