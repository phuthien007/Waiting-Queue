import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useGetAllTicketSystems } from "@api/manage";
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
import { useState, useEffect } from "react";
import { removeVietnameseTones } from "services/utils/validates";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const SubSystemForm = ({ type, data, saveData, loadingSave, isSuccess }) => {
  const { refetch, data: dataSystem } = useGetAllTicketSystems(
    {
      page: 0,
      size: 1000,
      "status.equals": 1,
    },
    { query: { enabled: false } }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    refetch();

    form.resetFields();
    form.setFieldsValue({
      ...data,
      status: data?.status ? data?.status.toString() : "false",
      systems: data?.systems ? data.systems.id : undefined,
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
    values.name = values.name?.trim();
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
            name="name"
            label="Tên phân hệ"
            rules={[
              {
                required: true,
                message: "Tên phân hệ không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên phân hệ chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên phân hệ" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="systems"
            label="Hệ thống"
            rules={[
              {
                required: true,
                message: "Hệ thống không được để trống",
              },
            ]}
          >
            <Select
              allowClear
              placeholder="Hệ thống"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
            >
              {dataSystem?.content.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            name="description"
            label="Mô tả"
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
            <Input type="text" placeholder="Mô tả" />
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
              <Select.Option key="true">Hoạt động</Select.Option>
              <Select.Option key="false">Ngừng hoạt động</Select.Option>
            </Select>
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

export default SubSystemForm;
