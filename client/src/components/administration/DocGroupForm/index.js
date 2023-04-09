/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useGetAllDepartment } from "@api/manage";
import {
  AutoComplete,
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
const DocGroupForm = ({ type, data, saveData, loadingSave, isSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataDeparment, setDataDepartment] = useState([]);
  const [form] = Form.useForm();
  const { refetch: getAllDepartment } = useGetAllDepartment({
    query: { enabled: false },
  });

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      ...data,
      status: data?.status.toString() || undefined,
    });
    getAllDepartment().then((res) => {
      setDataDepartment(res.data);
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
    values.department =
      values.department === "" ? undefined : values.department?.trim();
    saveData(type, values);
    // values.id = data.id
    // saveData({ ...values })
  };
  const [options, setOptions] = useState([]);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onSearch = (searchText) => {
    setOptions(
      !searchText
        ? []
        : [
            ...dataDeparment
              .filter((item) => item.trim().indexOf(searchText.trim()) !== -1)
              .map((item) => {
                return { value: item };
              }),
          ]
    );
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
            label="Tên nhóm văn bản"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên nhóm văn bản không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên nhóm văn bản chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên nhóm văn bản" />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Phòng quản lý"
            name="department"
          >
            <AutoComplete
              options={options}
              onSearch={onSearch}
              placeholder="Tên Phòng quản lý"
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

export default DocGroupForm;
