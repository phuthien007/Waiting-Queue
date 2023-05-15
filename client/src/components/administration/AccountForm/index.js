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

const AccountForm = ({ type, data, saveData, loading, reloadData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { role: roleUser, tenant } = useSelector(selectUser);
  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ...data,
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
    // values.id = data.id
    saveData({
      id: data.id,
      data: {
        ...values,
        tenantCode: tenant.tenantCode,
      },
    }).then((res) => {
      if (res) {
        reloadData();
        notification.success({
          message: "Thành công",
          description: "Lưu thành công",
        });
        handleOk();
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
            label="Họ tên:"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Họ tên không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Họ tên chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Họ tên" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Email:"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được bỏ trống",
              },
              ValidateEmail,
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Mật khẩu:"
            name="password"
            rules={[
              type === "add"
                ? {
                    required: true,
                    message: "Mật khẩu không được bỏ trống",
                  }
                : null,
              {
                validator: (_, value) =>
                  !value || ValidatePassword(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm ít nhất 01 kí tự chữ thường, 01 kí tự chữ in hoa, 01 kí tự đặc biệt, 01 kí tự số và không chứa kí tự khoảng trống"
                        )
                      ),
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Quyền:"
            name="role"
            rules={[
              {
                required: true,
                message: "Quyền hạn không được để trống",
              },
            ]}
          >
            <Select placeholder="Phân quyền">
              {roleUser === "SUPER ADMIN" && (
                <Select.Option key="super_admin" value="super_admin">
                  Quản trị hệ thống
                </Select.Option>
              )}
              <Select.Option key="admin" value="admin">
                Quản trị viên
              </Select.Option>
              <Select.Option key="operator" value="operator">
                Điều hành
              </Select.Option>
            </Select>
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
            style={{ marginBottom: 0 }}
            label="Trạng thái hoạt động:"
            name="isWorking"
            rules={[
              {
                required: true,
                message: "Trạng thái hoạt động không được để trống",
              },
            ]}
          >
            <Select
              disabled={type !== "add"}
              placeholder="Trạng thái hoạt động"
            >
              <Select.Option key="1" value={true}>
                Đang làm việc
              </Select.Option>
              <Select.Option key="0" value={false}>
                Không làm việc
              </Select.Option>
            </Select>
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
                        new Error("Mô tả chỉ chứa tối đa 500 kí tự")
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

export default AccountForm;
