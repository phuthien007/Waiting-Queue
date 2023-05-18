/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CreateQueueDto, UpdateQueueDto } from "@api/waitingQueue.schemas";

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
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ROLE_ENUM, STATUS_QUEUE_ENUM } from "services/utils/constants";
import { StatusQueueRender } from "services/utils/format";
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

type Props = {
  type: "add" | "edit" | "view";
  data: any;
  saveData?: (data: {
    queueCode?: string;
    data: CreateQueueDto | UpdateQueueDto;
  }) => Promise<any>;
  loading?: boolean;
  reloadData?: () => void;
};

const QueueForm: React.FC<Props> = ({
  type,
  data,
  saveData,
  loading,
  reloadData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { role: roleUser } = useSelector(selectUser);
  const { id } = useParams();
  const showModal = () => {
    form.resetFields();

    if (roleUser?.toLowerCase() === ROLE_ENUM.ADMIN) {
      form.setFieldsValue({
        ...data,
      });
    } else {
      form.setFieldsValue({
        ...data,
      });
    }

    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    values.code = data.code;
    // saveData({ ...values })
    saveData({
      queueCode: values.code,
      data: { ...values, eventId: id },
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
        <>
          {type === "view" ? (
            <Tooltip title="Xem">
              <Button
                onClick={showModal}
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
              />
            </Tooltip>
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
        </>
      )}

      <Modal
        title={
          type === "add"
            ? "Thêm mới"
            : type === "edit"
            ? "Chỉnh sửa"
            : "Xem chi tiết"
        }
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
            label="Tên hàng đợi:"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên hàng đợi không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên hàng đợi chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input
              bordered={type === "view" ? null : true}
              readOnly={type === "view"}
              type="text"
              placeholder="Tên hàng đợi"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Vị trí mã:"
            name="coord"
          >
            <Input
              placeholder="Vị trí mã"
              bordered={type === "view" ? null : true}
              readOnly={type === "view"}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
          >
            <Select
              bordered={type === "view" ? null : true}
              disabled={type === "view"}
            >
              {Object.keys(STATUS_QUEUE_ENUM).map((key) => (
                <Select.Option value={STATUS_QUEUE_ENUM[key]}>
                  {StatusQueueRender(STATUS_QUEUE_ENUM[key])}
                </Select.Option>
              ))}
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
            <Input
              bordered={type === "view" ? null : true}
              readOnly={type === "view"}
              placeholder="Mô tả"
            />
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
            <TextArea
              bordered={type === "view" ? null : true}
              readOnly={type === "view"}
              placeholder="Ghi chú"
              rows={3}
            />
          </Form.Item>

          {type === "view" ? null : (
            <>
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
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default QueueForm;
