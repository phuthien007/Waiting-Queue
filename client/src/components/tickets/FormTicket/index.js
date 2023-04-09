/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent */
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useGetTickets } from "@api/eticket";
import { useGetAllTicketSubSystems, useGetAllTicketSystems } from "@api/manage";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { validateFile } from "services/utils/File";
import { removeVietnameseTones } from "services/utils/validates";
import { selectUser } from "store/userSlice";
import FileList from "./FilesList";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
const FormTicket = ({ type, data, saveData, loadingSave, isSuccess }) => {
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [systemTicketId, setSystemTicketId] = useState();
  const [fileListUploaded, setFileListUploaded] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const { refetch: getSystem, data: dataSystem } = useGetAllTicketSystems(
    {
      page: 0,
      size: 10000,
      "status.equals": 1,
    },
    {
      query: {
        enabled: false,
      },
    }
  );
  const { refetch: getSubSystem, data: dataSubSystem } =
    useGetAllTicketSubSystems(
      {
        page: 0,
        size: 10000,
        "systemsId.equals": systemTicketId,
        "status.equals": 1,
      },
      {
        query: {
          enabled: false,
        },
      }
    );

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-undef
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const { refetch: getDetailTicket } = useGetTickets(data.id, {
    query: {
      enabled: false,
    },
  });
  // eslint-disable-next-line no-unused-vars
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const showModal = () => {
    getSystem();
    getSubSystem();
    form.resetFields();
    if (type === "edit") {
      getDetailTicket()
        .then((res) => {
          setFileListUploaded(res?.data?.ticketAttachFiles || []);
          form.setFieldsValue({
            ...res.data,
            subSystemTicket: res.data.ticketSubSystem?.id,
            systemTicket: res.data.ticketSubSystem.ticketSystem?.id,
            content: res.data.content,
            status: "0",
          });
          setIsModalOpen(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type === "add") {
      form.setFieldsValue({
        status: "0",
      });
      setIsModalOpen(true);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelPreview = () => setPreviewOpen(false);

  const onFinish = (values) => {
    values.id = data.id;
    // values.content = values.content;
    values.ticketSubSystemId = values.subSystemTicket;
    values.attachFiles =
      values?.attachFiles?.fileList?.map((item) => item.originFileObj) || [];
    saveData(type, values);
    // values.id = data.id
    // saveData({ ...values })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    getSubSystem();
  }, [setSystemTicketId, systemTicketId]);

  useEffect(() => {
    if (isSuccess) {
      handleOk();
    }
  }, [isSuccess]);
  return (
    <>
      {type === "add"
        ? (user.role.includes("USER") || user.role.includes("A1")) && (
            <Button
              onClick={showModal}
              style={{ color: "white", backgroundColor: "#1a9c02" }}
            >
              <Space>
                <i className="fe fe-plus" />
                Thêm mới
              </Space>
            </Button>
          )
        : (user.role.includes("USER") || user.role.includes("A1")) &&
          data?.status === 0 &&
          data?.user?.id === user.id && (
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
        width="750px"
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
            span: 5,
          }}
          wrapperCol={{
            span: 19,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Hệ thống"
            name="systemTicket"
            rules={[
              {
                required: true,
                message: "Hệ thống không được bỏ trống",
              },
            ]}
          >
            <Select
              maxTagCount={1}
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              allowClear
              onChange={(value) => {
                setSystemTicketId(value);
                form.setFieldValue("subSystemTicket", undefined);
              }}
              placeholder="Hệ thống"
            >
              {dataSystem?.content?.length
                ? dataSystem.content.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Phân hệ con"
            name="subSystemTicket"
            rules={[
              {
                required: true,
                message: "Phân hệ con không được bỏ trống",
              },
            ]}
          >
            <Select maxTagCount={1} allowClear placeholder="Phân hệ con">
              {dataSubSystem?.content?.length
                ? dataSubSystem.content.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tiêu đề"
            name="name"
            rules={[
              {
                required: true,
                message: "Tiêu đề không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 500)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tiêu đề chỉ chứa tối đa 500 kí tự")
                      ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[
              {
                required: true,
                message: "Nội dung không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 1000)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Nội dung chỉ chứa tối đa 1000 kí tự")
                      ),
              },
            ]}
          >
            <TextArea placeholder="Nội dung" rows={3} />
          </Form.Item>
          {data && data.id && (
            <Form.Item style={{ marginBottom: 5 }} label="Tệp đã tải lên">
              {fileListUploaded && fileListUploaded.length ? (
                <FileList
                  ListFileData={fileListUploaded}
                  documentId={data.id}
                  showModal={showModal}
                />
              ) : (
                <Alert message="Chưa có ảnh nào được tải lên" type="success" />
              )}
            </Form.Item>
          )}
          <Form.Item
            label="Ảnh minh họa"
            name="attachFiles"
            valuePropName="list"
            // getValueFromEvent={normFile}
          >
            <Upload
              multiple
              beforeUpload={(file) => {
                // get all list extention file from whiteList internet allow upload to server
                const extensions = [];
                const { maxSize } = 50 * 1024; // Kb
                const newObject = validateFile(file, extensions, maxSize);
                if (newObject !== false) {
                  return false;
                }
                return Upload.LIST_IGNORE;
              }}
              accept="image/*"
              listType="picture-card"
              onPreview={handlePreview}
            >
              Tải lên{" "}
            </Upload>
          </Form.Item>
          <Modal
            destroyOnClose
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancelPreview}
          >
            <img
              alt="example"
              style={{
                width: "100%",
                height: "100%",
              }}
              src={previewImage}
            />
          </Modal>

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

export default FormTicket;
