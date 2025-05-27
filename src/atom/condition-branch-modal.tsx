import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Collapse,
} from "antd";
import { GitBranch, Infinity, Trash2 } from "lucide-react";

const { Text } = Typography;
const { Panel } = Collapse;

interface Branch {
  id: string;
  label: string;
}

interface ConditionBranchModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (data: { branches: Branch[] }) => void;
  initialData?: { branches?: Branch[] };
  closable?: boolean;
}

export const ConditionBranchModal: React.FC<ConditionBranchModalProps> = ({
  open,
  onCancel,
  onOk,
  initialData,
  closable = true,
}) => {
  const [form] = Form.useForm();
  const [branches, setBranches] = useState<Branch[]>(
    initialData?.branches || [{ id: "1", label: "Branch 1" }]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const initialBranches = initialData?.branches?.length
        ? initialData.branches
        : [{ id: "1", label: "Branch 1" }];
      setBranches(initialBranches);
      form.setFieldsValue({ branches: initialBranches });
    }
  }, [open, initialData, form]);

  const addBranch = () => {
    const newBranch = { id: `${branches.length + 1}`, label: `Branch ${branches.length + 1}` };
    setBranches([...branches, newBranch]);
    form.setFieldsValue({ branches: [...branches, newBranch] });
  };

  const removeBranch = (index: number) => {
    if (branches.length <= 1) return; 
    const newBranches = branches.filter((_, i) => i !== index);
    setBranches(newBranches);
    form.setFieldsValue({ branches: newBranches });
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      onOk({ branches: values.branches });
      form.resetFields();
      setBranches([{ id: "1", label: "Branch 1" }]);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setBranches([{ id: "1", label: "Branch 1" }]);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space align="center">
          <GitBranch
            size={20}
            className="text-blue-500 transition-transform duration-300 hover:scale-110"
          />
          <Text strong className="text-gray-800 text-lg">
            Configure Branches
          </Text>
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
      closable={closable}
      closeIcon={
        closable ? (
          <svg
            className="w-5 h-5 text-gray-500 hover:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Close modal"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : undefined
      }
      className="rounded-lg shadow-xl"
      styles={{
        body: { padding: "24px", background: "#fafafa" },
        header: { borderBottom: "1px solid #e5e7eb", padding: "16px 24px" },
      }}
      okButtonProps={{
        className:
          "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
      }}
      cancelButtonProps={{
        className:
          "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        className="mt-4"
      >
        <Form.List name="branches">
          {(fields) =>
            fields.map((field, index) => (
              <Space
                key={field.key}
                className="flex items-center w-full mb-4"
                align="baseline"
              >
                <Form.Item
                  {...field}
                  name={[field.name, "label"]}
                  label={`Branch ${index + 1} Label`}
                  rules={[{ required: true, message: "Branch label is required" }]}
                  className="flex-1"
                >
                  <Input
                    placeholder={`e.g., Option ${index + 1}`}
                    maxLength={20}
                    className="rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                  />
                </Form.Item>
                {branches.length > 1 && (
                  <Button
                    type="text"
                    icon={<Trash2 size={16} className="text-red-500" />}
                    onClick={() => removeBranch(index)}
                    className="hover:bg-red-50 rounded-md"
                    aria-label={`Remove branch ${index + 1}`}
                  />
                )}
              </Space>
            ))
          }
        </Form.List>
        <Button
          type="dashed"
          onClick={addBranch}
          block
          className="mt-2 text-blue-600 border-blue-300 hover:border-blue-400 rounded-md"
          aria-label="Add new branch"
        >
          + Add Branch
        </Button>

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
                  Branch Configuration Tips
                </Text>
              </Space>
            }
            key="1"
          >
            <div className="p-3 bg-blue-50 rounded-md">
              <Text className="text-gray-600 text-sm">
                Create clear and descriptive branch labels:
                <ul className="mt-2 space-y-1">
                  <li>
                    • Use concise names like "Option 1", "Path A", or "Choice X".
                  </li>
                  <li>
                    • Ensure labels reflect the workflow’s decision points.
                  </li>
                  <li>
                    • Add up to 5 branches for complex decisions (recommended).
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