import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Tooltip,
  Collapse,
} from "antd";
import { GitBranch, Infinity } from "lucide-react";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

interface ConditionModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (data: any) => void;
  initialData?: any;
}

export const ConditionModal: React.FC<ConditionModalProps> = ({
  open,
  onCancel,
  onOk,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      form.setFieldsValue({
        condition: initialData.condition || "",
        trueLabel: initialData.trueLabel || "True",
        falseLabel: initialData.falseLabel || "False",
        description: initialData.description || "",
      });
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({
        trueLabel: "True",
        falseLabel: "False",
      });
    }
  }, [open, initialData, form]);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <Space align="center">
          <GitBranch
            size={20}
            className="text-amber-600 transition-transform duration-300 hover:scale-110"
          />
          <Title level={4} className="mb-0 text-gray-800">
            Configure Condition Node
          </Title>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Save"
      cancelText="Cancel"
      destroyOnClose
      className="rounded-lg shadow-xl"
      styles={{
        body: { padding: "24px", background: "#fafafa" },
        header: { borderBottom: "1px solid #e5e7eb", padding: "16px 24px" },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-4"
      >
        <Form.Item
          name="condition"
          label={
            <Space>
              <Text strong className="text-gray-700">
                Condition Expression
              </Text>
              <Tooltip
                title="Use JavaScript-like expressions (e.g., value > 100, status === 'active')"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Infinity size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
          rules={[
            { required: true, message: "Condition expression is required" },
            { min: 3, message: "Must be at least 3 characters" },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="e.g., value > 100, status === 'active'"
            showCount
            maxLength={200}
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
                title="Describe what this condition checks"
                color="#1e90ff"
                overlayInnerStyle={{ borderRadius: "6px", padding: "8px 12px" }}
              >
                <Infinity size={14} className="text-blue-500 cursor-pointer" />
              </Tooltip>
            </Space>
          }
        >
          <Input
            placeholder="e.g., Checks if user is eligible"
            maxLength={100}
            showCount
            className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="trueLabel"
              label={
                <Text strong className="text-gray-700">
                  True Branch Label
                </Text>
              }
              rules={[{ required: true, message: "True label is required" }]}
            >
              <Input
                placeholder="True"
                maxLength={20}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="falseLabel"
              label={
                <Text strong className="text-gray-700">
                  False Branch Label
                </Text>
              }
              rules={[{ required: true, message: "False label is required" }]}
            >
              <Input
                placeholder="False"
                maxLength={20}
                className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
              />
            </Form.Item>
          </Col>
        </Row>

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
                <Infinity size={16} className="text-blue-500" />
                <Text strong className="text-gray-700">
                  Expression Tips
                </Text>
              </Space>
            }
            key="1"
          >
            <div className="p-3 bg-blue-50 rounded-md">
              <Text className="text-gray-600 text-sm">
                Use JavaScript-like expressions for conditions:
                <ul className="mt-2 space-y-1">
                  <li>
                    •{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      age &gt;= 18
                    </code>{" "}
                    - Age 18 or older
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      status === 'approved'
                    </code>{" "}
                    - Status is approved
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      score &gt; 80 && attempts &lt;= 3
                    </code>{" "}
                    - Multiple conditions
                  </li>
                </ul>
              </Text>
            </div>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  );
};
