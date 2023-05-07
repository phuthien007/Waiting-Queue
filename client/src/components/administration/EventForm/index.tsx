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
import {
  useFilesControllerRemove,
  useFilesControllerUploadFile,
} from "@api/waitingQueue";
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
import { UploadFile } from "antd/es/upload/interface";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { serveImage } from "services/utils";
import { FORMAT_DATE_MINUTE, WHITE_LIST_IMAGE } from "services/utils/constants";
import {
  checkSizeImage,
  checkTypeImage,
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

type Props = {
  type: "add" | "edit" | "view";
  data: EventDto;
  saveData?: (data: any) => Promise<any>;
  loading?: boolean;
  reloadData?: () => void;
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

  const { mutateAsync: removeImage, isLoading: loadingRemoveImage } =
    useFilesControllerRemove();

  const { mutateAsync: uploadImage, isLoading: loadingUploadImage } =
    useFilesControllerUploadFile();

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ...data,
      from: data.from ? moment(data.from) : null,
      to: data.to ? moment(data.to) : null,
    });

    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: EventDto) => {
    if (
      values?.drawImagePath &&
      values?.drawImagePath?.fileList?.length === 0
    ) {
      console.log("Success:", values);
      notification.error({
        message: "Lỗi",
        description: "Bạn được chọn 1 hình ảnh",
      });
      return;
    } else {
      values.id = data.id;
      const oldImage = data.drawImagePath;
      // // validate data
      if (!values.from && !values.to && values.daily === false) {
        notification.error({
          message: "Lỗi",
          description: "Cần phải có thời gian cho sự kiện",
        });
        return;
      } else if (values.from && values.to && values.daily === true) {
        notification.error({
          message: "Lỗi",
          description: "Không thể cùng lúc chọn sự kiện lặp lại và thời gian",
        });
      }

      // handle Image
      if (values.drawImagePath && values.drawImagePath.file) {
        const res = await uploadImage({
          data: {
            file: values.drawImagePath.file,
          },
        });
        if (res) {
          values.drawImagePath = res;
        }
        // remove old Image
        if (oldImage) {
          try {
            removeImage({
              params: {
                fileName: oldImage,
              },
            });
          } catch (error) {
            console.log(error);
          }
        }
      }

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
    }
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
          {type === "edit" ? (
            <Tooltip title="Sửa">
              <Button
                onClick={showModal}
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Xem chi tiết">
              <Button
                onClick={showModal}
                type="primary"
                shape="circle"
                icon={<EyeOutlined />}
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
            <Input
              readOnly={type === "view"}
              bordered={type === "view" ? null : true}
              type="text"
              placeholder="Tên sự kiện"
            />
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
            <Input
              readOnly={type === "view"}
              bordered={type === "view" ? null : true}
              type="text"
              placeholder="Địa điểm"
            />
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
              disabled={type === "view"}
              bordered={type === "view" ? null : true}
              showTime={{
                format: "HH:mm",
              }}
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
              disabled={type === "view"}
              bordered={type === "view" ? null : true}
              showTime={{
                format: "HH:mm",
              }}
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
            <Checkbox disabled={type === "view"} />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
            valuePropName="checked"
          >
            <Checkbox disabled={type === "view"} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Ảnh:"
            name="drawImagePath"
            rules={[
              {
                required: true,
                message: "Ảnh không được bỏ trống",
              },
            ]}
          >
            <Upload
              defaultFileList={
                data.drawImagePath
                  ? [
                      {
                        uid: Math.random() * 1000,
                        name: data.drawImagePath,
                        status: "done",
                        url: serveImage(data.drawImagePath),
                      },
                    ]
                  : []
              }
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                if (!checkSizeImage(file.size)) {
                  notification.error({
                    message: "Lỗi",
                    description: "Ảnh không được quá 50MB",
                  });
                  return Upload.LIST_IGNORE;
                }

                if (!checkTypeImage(file.type)) {
                  notification.error({
                    message: "Lỗi",
                    description: `Ảnh phải có định dạng là ${WHITE_LIST_IMAGE.join(
                      "; "
                    )}`,
                  });
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
            >
              {type !== "view" && (
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              )}
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
            <Input
              placeholder="Mô tả"
              readOnly={type === "view"}
              bordered={type === "view" ? null : true}
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
              placeholder="Ghi chú"
              rows={3}
              readOnly={type === "view"}
              bordered={type === "view" ? null : true}
            />
          </Form.Item>

          {type !== "view" && (
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
          )}
        </Form>
      </Modal>
    </>
  );
};

export default EventForm;
