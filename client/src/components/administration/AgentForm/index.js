/* eslint-disable no-unused-vars */
/**
 * hidden or not transfer manage agents
 */

import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Transfer,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const AgentForm = ({ type, data, saveData, loadingSave, isSuccess }) => {
  const mockData = [...data.listAgent];
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectA1, setSelectA1] = useState(
    data?.type ? data.type.toString() !== "2" : true
  );
  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setSelectedKeys([]);
    setTargetKeys(data?.manageAgents || []);
    form.resetFields();
    form.setFieldsValue({
      ...data,
      status: data?.status.toString() || undefined,
      type: data?.type ? data.type.toString() : undefined,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    values.id = data.id;
    saveData(type, values);
    // values.id = data.id
    // saveData({ ...values })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (isSuccess) {
      handleOk();
    }
  }, [isSuccess]);
  return (
    <>
      {type === "add" ? (
        <Button
          onClick={showModal}
          style={{ backgroundColor: "#1a9c02", color: "white" }}
        >
          <Space>
            <i className="fe fe-plus" />
            Thêm mới
          </Space>
        </Button>
      ) : (
        <Tooltip title="Sửa">
          <Button
            onClick={showModal}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
          />
        </Tooltip>
      )}
      <Modal
        title={type === "add" ? "Thêm mới" : "Chỉnh sửa"}
        okText="Lưu"
        width="70%"
        cancelText="Hủy"
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Tên đơn vị"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên đơn vị không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên đơn vị chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên đơn vị" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Loại đơn vị:"
            name="type"
            rules={[
              {
                required: true,
                message: "Loại đơn vị không được bỏ trống",
              },
            ]}
          >
            <Select
              placeholder="Loại đơn vị"
              onChange={(e) => {
                if (e === "1") {
                  setSelectA1(true);
                } else {
                  setSelectA1(false);
                }
              }}
            >
              <Select.Option key="1" value="1">
                A1
              </Select.Option>
              <Select.Option key="2" value="2">
                Đơn vị
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            hidden={selectA1}
            style={{
              marginBottom: 0,
            }}
            label="Đơn vị quản lý:"
            name="manageAgents"
          >
            <Transfer
              dataSource={mockData}
              targetKeys={targetKeys}
              oneWay
              key={(item) => item.id}
              rowKey={(item) => item.id}
              selectedKeys={selectedKeys}
              onChange={onChange}
              onSelectChange={onSelectChange}
              render={(item) => item.name}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
            rules={[
              {
                required: true,
                message: "Trạng thái không được để trống",
              },
            ]}
          >
            <Select placeholder="Trạng thái">
              <Select.Option key="1">Hoạt động</Select.Option>
              <Select.Option key="0">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 500)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mô tả chỉ chứa tối đa 500 kí tự")
                      ),
              },
            ]}
          >
            <TextArea placeholder="Mô tả" rows={3} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row>
              <Col span={4}>
                <Button
                  icon={<i className="fe fe-x mr-2" />}
                  onClick={handleCancel}
                  type="danger"
                >
                  Hủy
                </Button>
              </Col>
              <Col offset={4} span={16}>
                <Button
                  loading={loadingSave}
                  icon={<i className="fe fe-save mr-2" />}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AgentForm;
