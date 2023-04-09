import { UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Tag,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import { validateFile } from "services/utils/File";
import { useCreateAndPublishDocument, usePublishDocument } from "@api/document";
import moment from "moment";
import SelectAccountForm from "./SelectAccountForm";
import FileList from "../DocumentForm/FilesList";

const tailLayout = {
  // setup end layout
  wrapperCol: { offset: 8, span: 16 },
};
const PublishForm = ({
  type,
  style,
  data,
  listChooseFile,
  refetchData,
  handleValidate,
  dataDocGroup,
  setListChooseFile,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataReceiver, setDataReceiver] = useState([]);
  const [newDataFromCreateDocument, setNewDataFromCreateDocument] = useState();
  const [dataUser, setDataUser] = useState([]);
  const [form] = Form.useForm();
  const [dataFile, setDataFile] = useState([]);

  const [fileListUploaded, setFileListUploaded] = useState([]);
  const { isLoading: loadingPublish, mutateAsync: publishDocument } =
    usePublishDocument();
  const {
    isLoading: loadingCreateAndPublish,
    mutateAsync: publishCreateAndPublish,
  } = useCreateAndPublishDocument();
  const showModal = () => {
    form.resetFields();
    setDataUser([])
    setDataReceiver([])
    setFileListUploaded(
      listChooseFile?.length > 0 ? listChooseFile : data?.files || []
    );
    if (type && type === "detail") {
      setListChooseFile([]);
    }
    setDataReceiver([]);
    setDataUser([]);

    if (type === "form") {
      handleValidate().then((values, err) => {
        if (!err) {
          setNewDataFromCreateDocument({ ...values, docgroup: dataDocGroup });
          setIsModalOpen(true);
        }
      });
    } else {
      form.setFieldsValue({
        ...data,
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
  const props = {
    // eslint-disable-next-line no-shadow
    beforeUpload: (file) => {
      const extensions = data?.doctype?.extensions || [];
      const { maxSize } = data?.doctype; // Kb
      const newObject = validateFile(file, extensions, maxSize);
      if (newObject !== false) {
        return false;
      }
      return Upload.LIST_IGNORE;
    },
    multiple: true,
    accept: data?.doctype?.extensions.map((item) => `.${item}`).join(","),
  };

  const onFinish = (values) => {
    // values.id = data.id
    if (
      data?.userHasA1Role &&
      dataUser.length <= 0 &&
      dataReceiver.length <= 0
    ) {
      notification.warn({
        message: "Cảnh báo",
        description: "Chưa có tài khoản nào được chọn để nhận hoặc chia sẻ.",
      });
    } else if (type === "detail") {
      if (dataFile?.length <= 0 && values?.attachFiles?.length <= 0) {
        notification.warn({
          message: "Cảnh báo",
          description: "Chưa có file đính kèm",
        });
      } else {
        values.attachFiles =
          values?.attachFiles?.map((item) => item.originFileObj) || [];
        publishDocument({
          id: data?.id,
          data: {
            ...values,
            files: dataFile?.map((item) => item.id) || [],
            users: dataUser.map((item) => item.id),
            receivers: dataReceiver.map((item) => item.id),
          },
        })
          .then(() => {
            notification.success({
              message: "Thông báo",
              description: "Đã phát hành tài liệu thành công",
            });
            handleOk();
            refetchData();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (type === "form") {
      values = {
        ...values,
        ...newDataFromCreateDocument,
      };
      values.id = newDataFromCreateDocument.id;
      values.emailCC =
        newDataFromCreateDocument?.emailCC?.join(",") || undefined;
      values.emailBCC =
        newDataFromCreateDocument?.emailBCC?.join(",") || undefined;
      values.attachFiles =
        newDataFromCreateDocument?.attachFiles?.map(
          (item) => item.originFileObj
        ) || [];
      values.dueDate = newDataFromCreateDocument?.dueDate
        ? moment(newDataFromCreateDocument?.dueDate._d).toISOString()
        : undefined;
      publishCreateAndPublish({
        data: {
          ...values,

          //   ...newDataFromCreateDocument,
          users: dataUser.map((item) => item.id),
          receivers: dataReceiver.map((item) => item.id),
        },
      })
        .then(() => {
          notification.success({
            message: "Thông báo",
            description: "Đã phát hành tài liệu thành công",
          });
          handleOk();
          refetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    setDataFile(fileListUploaded);
  }, [fileListUploaded]);
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const setReceiver = (values) => {
    setDataReceiver([...values]);
  };
  const setUser = (values) => {
    setDataUser([...values]);
  };

  return (
    <>
      <Button
        icon={<i className="fe fe-check-circle mr-2" />}
        type="ghost"
        style={{ backgroundColor: "#00C851", color: "white", ...style }}
        onClick={showModal}
        key={Math.random()}
      >
        {type && type === "detail" ? (
          <span>Phát hành </span>
        ) : (
          <span>Phát hành ngay</span>
        )}
      </Button>
      <Modal
        footer={null}
        title="Phát hành văn bản"
        open={isModalOpen}
        width="700px"
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
            span: 18,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {type === "detail" && (
            <>
              <Form.Item
                style={{ marginBottom: 0 }}
                label="Tiêu đề"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tiêu đề không được bỏ trống",
                  },
                  {
                    validator: (_, value) =>
                      !value || (value.length >= 0 && value.length <= 256)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Tiêu đề chỉ chứa tối đa 256 kí tự")
                          ),
                  },
                ]}
              >
                <Input type="text" placeholder="Tiêu đề" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 5 }}
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
              {data && data.id && (
                <Form.Item style={{ marginBottom: 5 }} label="Tệp đã tải lên">
                  {fileListUploaded && fileListUploaded.length ? (
                    <FileList
                      type="publish"
                      dataFile={dataFile}
                      setDataFile={setDataFile}
                      ListFileData={fileListUploaded}
                      documentId={data.id}
                      showModal={showModal}
                      setListChooseFile={setListChooseFile}
                    />
                  ) : (
                    <Alert
                      message="Chưa có tệp tin nào được tải lên"
                      type="success"
                    />
                  )}
                </Form.Item>
              )}
              <Form.Item
                label="Tệp đính kèm"
                valuePropName="list"
                getValueFromEvent={normFile}
                style={{ marginBottom: 0 }}
                name="attachFiles"
                rules={
                  // require
                  [
                    {
                      required: type === "add",
                      message: "Tệp đính kèm không được bỏ trống",
                    },
                  ]
                }
              >
                <Upload {...props}>
                  <Button
                    // disabled={!form.getFieldValue('doctype') && type === 'add'}
                    icon={<UploadOutlined />}
                  >
                    Tải lên
                  </Button>
                </Upload>
              </Form.Item>
            </>
          )}

          {(!data?.id || data?.userHasA1Role) && (
            <Form.Item
              style={{ marginBottom: 0 }}
              label="Đơn vị nhận"
              name="receivers"
            >
              <SelectAccountForm setData={setReceiver} data={dataReceiver} />
              {dataReceiver.length <= 0 ? (
                <Alert message="Chưa có đơn vị nào được chọn" type="success" />
              ) : (
                dataReceiver.map((item) => (
                  <Tag color="green" key={`${item.id}receiver`}>
                    {" "}
                    {item.fullName}{" "}
                  </Tag>
                ))
              )}
            </Form.Item>
          )}
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Tài khoản được chia sẻ"
            name="users"
          >
            <SelectAccountForm setData={setUser} data={dataUser} />

            {dataUser.length <= 0 ? (
              <Alert message="Chưa có tài khoản nào được chọn" type="success" />
            ) : (
              dataUser.map((item) => (
                <Tag color="blue" key={`${item.id}user`}>
                  {" "}
                  {item.fullName}{" "}
                </Tag>
              ))
            )}
          </Form.Item>

          <Divider />
          <Form.Item {...tailLayout} style={{ marginBottom: "0px" }}>
            <Row style={{ justifyContent: "flex-end" }}>
              <Button
                loading={loadingPublish || loadingCreateAndPublish}
                type="primary"
                htmlType="submit"
                icon={<i className="fe fe-check-circle mr-2" />}
              >
                Phát hành
              </Button>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PublishForm;
