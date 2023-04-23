/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
  TreeSelect,
  Upload,
  notification,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
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

interface Props {
  type: "add" | "edit";
  data: any;
  saveData?: (data: any) => Promise<any>;
  loading?: boolean;
  reloadData?: () => void;
}

const EventForm: React.FC<Props> = ({
  type,
  data,
  saveData,
  loading,
  reloadData,
}) => {
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
    console.log("values", values);
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
            label="Tên sự kiện:"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên sự kiện không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên sự kiện chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên sự kiện" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0, width: "100%" }}
            label="Ngày bắt đầu:"
            name="startDate"
          >
            <DatePicker
              allowClear
              style={{ width: "100%" }}
              placeholder="Ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0, width: "100%" }}
            label="Ngày kết thúc:"
            name="endDate"
          >
            <DatePicker
              allowClear
              style={{ width: "100%" }}
              placeholder="Ngày kết thúc"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Hằng ngày:"
            name="daily"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Địa điểm:" name="place">
            <Input type="text" placeholder="Địa điểm" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="Địa điểm:" name="place">
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
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
            <Input placeholder="Mô tả" />
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
                  className="ant-btn-danger"
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

export default EventForm;
