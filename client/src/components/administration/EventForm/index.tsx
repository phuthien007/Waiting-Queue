/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { EventDto } from "@api/waitingQueue.schemas";
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
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FORMAT_DATE_MINUTE } from "services/utils/constants";
import {
  removeVietnameseTones,
  ValidateEmail,
  ValidatePassword,
  ValidateUserName,
} from "services/utils/validates";
import { selectUser } from "store/userSlice";
// import ValidateUserName from '../../../services/utils/validates'
import type { RangePickerProps } from "antd/es/date-picker";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { SHOW_PARENT } = TreeSelect;

type Props = {
  type: "add" | "edit" | "view";
  data: EventDto;
  saveData?: (data: any) => Promise<any>;
  loading?: boolean;
  reloadData?: () => void;
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

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
      from: moment(data.from),
      to: moment(data.to),
    });

    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: EventDto) => {
    values.id = data.id;
    // saveData({ ...values })
    // TODO: validate data
    saveData({
      id: values.id,
      data: { ...values, status: values.status ? 1 : 0 },
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
        width="80%"
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
            style={{ marginBottom: 0 }}
            label="Địa điểm:"
            name="place"
            rules={[
              {
                required: true,
                message: "Địa điểm không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Địa điểm chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Địa điểm" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0, width: "100%" }}
            label="Ngày bắt đầu:"
            name="from"
            rules={[
              // validate time start must be greater than time now
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || moment().isBefore(value)) {
                    return Promise.resolve();
                  }
                  if (!moment().isBefore(value)) {
                    return Promise.reject(
                      new Error("Ngày bắt đầu phải lớn hơn ngày hiện tại")
                    );
                  }

                  return Promise.reject(new Error("Ngày bắt đầu không hợp lệ"));
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              allowClear
              style={{ width: "100%" }}
              format={(value) => moment(value).format(FORMAT_DATE_MINUTE)}
              placeholder="Ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0, width: "100%" }}
            label="Ngày kết thúc:"
            name="to"
            rules={[
              // validate time start must be greater than time now
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || moment().isBefore(value)) {
                    return Promise.resolve();
                  }
                  if (!moment().isBefore(value)) {
                    return Promise.reject(
                      new Error("Ngày kết thúc phải lớn hơn ngày hiện tại")
                    );
                  }

                  return Promise.reject(
                    new Error("Ngày kết thúc không hợp lệ")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              allowClear
              style={{ width: "100%" }}
              format={(value) => moment(value).format(FORMAT_DATE_MINUTE)}
              placeholder="Ngày kết thúc"
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Hằng ngày:"
            name="daily"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Địa điểm:"
            name="drawImagePath"
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
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
