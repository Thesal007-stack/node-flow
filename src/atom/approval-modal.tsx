import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { NODE_CONFIGURATIONS } from "../constants/node-configs";
import { TreeSelect } from "antd";

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: "Departmental Approvals",
    value: "departmental",
    key: "departmental",
    children: [
      {
        title: "Team Lead",
        value: "departmental-team-lead",
        key: "departmental-team-lead",
      },
      {
        title: "Project Manager",
        value: "departmental-project-manager",
        key: "departmental-project-manager",
      },
    ],
  },
  {
    title: "Executive Approvals",
    value: "executive",
    key: "executive",
    children: [
      {
        title: "HR Manager",
        value: "executive-hr-manager",
        key: "executive-hr-manager",
      },
      {
        title: "Finance Head",
        value: "executive-finance-head",
        key: "executive-finance-head",
      },
      {
        title: "Operations Director",
        value: "executive-operations-director",
        key: "executive-operations-director",
      },
    ],
  },
  {
    title: "Final Approvals",
    value: "final",
    key: "final",
    children: [
      {
        title: "CEO",
        value: "final-ceo",
        key: "final-ceo",
      },
      {
        title: "Board of Directors",
        value: "final-board",
        key: "final-board",
      },
    ],
  },
];

interface ApprovalModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (data: any) => void;
  initialData?: any;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  open,
  onCancel,
  onOk,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(["Line Manager"]);


  //Using Tree Select
  const onChange = (newValue: string[]) => {
    console.log("onChange ", newValue);
    setValue(newValue);
  };
  const tProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        label: initialData?.label || NODE_CONFIGURATIONS.approval.label,
        description:
          initialData?.description || NODE_CONFIGURATIONS.approval.description,
        approver: initialData?.approver || "",
      });
    }
  }, [open, initialData, form]);

  const handleFinish = (values: any) => {
    onOk(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Approval Node Properties"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialData}
      >
        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: "Please enter a label" }]}
        >
          <Input placeholder="e.g., Manager Approval" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input placeholder="e.g., Requires manager sign-off" />
        </Form.Item>
        <Form.Item
          name="approver"
          label="Approver"
          rules={[{ required: true, message: "Please enter an approver" }]}
        >
          <TreeSelect {...tProps} />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { ApprovalModal };
