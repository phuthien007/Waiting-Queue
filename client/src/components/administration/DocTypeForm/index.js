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
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const DocTypeForm = ({ type, data, saveData, loadingSave, isSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ...data,
      status: data?.status.toString() || undefined,
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
    // saveData({ ...values })
  };

  useEffect(() => {
    if (isSuccess) {
      handleOk();
    }
  }, [isSuccess]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
          style={{ marginBottom: 0 }}
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
            label="Tên loại văn bản"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên loại văn bản không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Loại văn bản chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên loại văn bản" />
          </Form.Item>

          <Form.Item
            label="Mã"
            name="code"
            rules={[
              {
                required: true,
                message: "Mã loại văn bản không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mã loại văn bản  chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" disabled={type !== "add"} placeholder="Mã" />
          </Form.Item>

          <Form.Item
            label="Dung lượng tối đa:"
            name="maxSize"
            help="Để 0 nếu không muốn giới hạn"
            rules={[
              {
                required: true,
                message: "Để 0 nếu không muốn giới hạn",
              },
              {
                validator: (_, value) =>
                  !value || value >= 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Để 0 nếu không muốn giới hạn")),
              },
            ]}
          >
            <Input
              addonAfter="Kb"
              type="number"
              min={0}
              placeholder="Dung lượng tối đa"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            name="extensions"
            label="Định dạng"
            help="Để trống nếu không muốn giới hạn, ấn Enter sau mỗi loại file"
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Loại file"
            >
              {form.getFieldValue("extensions")}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            name="status"
            label="Trạng thái"
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

export default DocTypeForm;
