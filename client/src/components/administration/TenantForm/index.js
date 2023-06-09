/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
  TreeSelect,
  notification,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  removeVietnameseTones,
  ValidateEmail,
  ValidatePassword,
  ValidateUserName,
} from "services/utils/validates";
import { selectUser } from "store/userSlice";
// import ValidateUserName from '../../../services/utils/validates'

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { SHOW_PARENT } = TreeSelect;

const TenantForm = ({ type, data, saveData, loading, reloadData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { role: roleUser } = useSelector(selectUser);

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ...data,
      role: data?.role,
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
    // saveData({ ...values })
    saveData({
      id: values.id,
      data: { ...values },
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Thành công",
          description: "Lưu thành công",
        });
        handleCancel();
        reloadData();
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {}, []);

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
        width="50%"
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
            label="Tên công ty:"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên công ty không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên công ty chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên công ty" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Email:"
            name="contactEmail"
            rules={[
              {
                required: true,
                message: "Email không được bỏ trống",
              },
              ValidateEmail,
            ]}
          >
            <Input
              disabled={type === "edit"}
              type="email"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Số điện thoại:"
            name="contactPhone"
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Địa chỉ:"
            name="address"
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái tài khoản:"
            name="status"
            rules={[
              {
                required: true,
                message: "Trạng thái không được để trống",
              },
            ]}
          >
            <Select placeholder="Trạng thái">
              <Select.Option key={1} value={1}>
                Hoạt động
              </Select.Option>
              <Select.Option key={0} value={0}>
                Ngừng hoạt động
              </Select.Option>
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
            <Input placeholder="Mô tả" rows={3} />
          </Form.Item>
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 500)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Ghi chú chỉ chứa tối đa 500 kí tự")
                      ),
              },
            ]}
          >
            <TextArea placeholder="Ghi chú" rows={3} />
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
                  loading={loading}
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

export default TenantForm;
