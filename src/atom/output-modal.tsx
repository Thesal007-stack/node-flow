import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Space, Typography, Tooltip } from 'antd';
import { ArrowRight, InfoIcon } from 'lucide-react';
import { BaseModal } from './base-modal';

const { Title, Text } = Typography;
const { Option } = Select;

interface OutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export const OutputModal: React.FC<OutputModalProps> = ({
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
        destination: initialData?.destination || 'database',
        format: initialData?.format || 'json',
        description: initialData?.description || '',
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
      console.error('Validation failed:', error);
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
          <ArrowRight
            size={20}
            className="text-gray-600 transition-transform duration-300 hover:scale-110"
          />
          <Title level={4} className="mb-0 text-gray-800">
            Configure Output Destination
          </Title>
        </Space>
      }
      width={600}
      styles={{
        body: { padding: '24px', background: '#fafafa' },
        header: { borderBottom: '1px solid #e5e7eb', padding: '16px 24px' },
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
          name="destination"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Output Destination
              </Text>
              <Tooltip
                title="Select where the output data will be sent"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: '6px', padding: '8px 12px' }}
              >
                <InfoIcon size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: 'Please select an output destination' }]}
        >
          <Select
            placeholder="Select output destination"
            className="rounded-md"
            style={{ height: '40px' }}
          >
            <Option value="database">Database</Option>
            <Option value="api">API Endpoint</Option>
            <Option value="file">File</Option>
            <Option value="email">Email</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="format"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Output Format
              </Text>
              <Tooltip
                title="Select the format for the output data"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: '6px', padding: '8px 12px' }}
              >
                <InfoIcon size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: 'Please select an output format' }]}
        >
          <Select
            placeholder="Select output format"
            className="rounded-md"
            style={{ height: '40px' }}
          >
            <Option value="json">JSON</Option>
            <Option value="csv">CSV</Option>
            <Option value="xml">XML</Option>
            <Option value="text">Plain Text</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Description (Optional)
              </Text>
              <Tooltip
                title="Describe the purpose of this output"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: '6px', padding: '8px 12px' }}
              >
                <InfoIcon size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
        >
          <Input
            placeholder="e.g., Exports data to reporting database"
            maxLength={100}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

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