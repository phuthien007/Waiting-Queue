/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
import { CloseOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useGetDocgroupsDepartment, useGetListDocTypes } from "@api/manage";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Tooltip,
  TreeSelect,
  Upload,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DB_DOCUMENT_STATUS_NEW, FORMAT_DATE } from "services/utils/constants";
import { validateFile } from "services/utils/File";
import {
  useGetAllEmailCollectionsData,
  useGetDocumentById,
} from "@api/document";
import moment from "moment";
// import { ValidateEmail } from 'services/utils/validates'
import { EmailCollectionRule } from "services/utils/validates/rules";
import { removeVietnameseTones } from "services/utils/validates";
import { selectUser } from "store/userSlice";
import ListEmail from "../ListEmail";
import FileList from "./FilesList";
import PublishForm from "../PublishForm";

const tailLayout = {
  // setup end layout
  wrapperCol: { offset: 8, span: 16 },
};

const { SHOW_PARENT } = TreeSelect;
const DocumentForm = ({
  type,
  data,
  saveData,
  loadingSave,
  isSuccess,
  refetchDataDocument,
}) => {
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileListUploaded, setFileListUploaded] = useState([]);
  const [textEmail, setTextEmail] = useState();
  const [form] = Form.useForm();
  const { refetch: refetchGetDocType, data: dataGetDocType } =
    useGetListDocTypes({
      query: {
        enabled: false,
      },
    });
  const [docgroups, setDocgroups] = useState();
  const [isDoctypeSelected, setIsDoctypeSelected] = useState(false);

  const {
    refetch: refetchGetDocGroupDepartment,
    data: dataGetDocGroupDepartment,
  } = useGetDocgroupsDepartment(
    {
      its: true,
    },
    {
      query: {
        enabled: false,
      },
    }
  );
  // const [fileList, setFileList] = useState([])
  const tProps = {
    treeData:
      dataGetDocGroupDepartment?.map((item) =>
        item.children && item.children.length > 0
          ? {
              ...item,
              disableCheckbox: true,
            }
          : item
      ) || [],
    onSelect: (value, node) => {
      if (!node.children || node.children.length <= 1) {
        if (node.children && node.children?.length === 1) {
          setDocgroups(value);
        } else {
          setDocgroups(value.split(node.title)[0]);
        }
      } else {
        notification.error({
          message: "Thông báo",
          description: "Vui lòng chọn một nhóm đơn vị cụ thể",
        });
        setDocgroups();
        form.setFieldValue("docgroup", undefined);
      }
    },
    showSearch: true,
    // treeCheckable: true,
    allowClear: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Nhóm văn bản",
  };

  const { refetch: refetchGetdocument } = useGetDocumentById(
    data?.id,
    {
      receiver: false,
    },
    {
      query: {
        enabled: false,
      },
    }
  );

  const { data: getAllCollectionEmail, refetch: refetchCollectionEmail } =
    useGetAllEmailCollectionsData(
      {
        text: textEmail,
      },
      {
        query: {
          enabled: false,
        },
      }
    );

  const showModal = () => {
    refetchGetDocType();
    refetchGetDocGroupDepartment();
    form.resetFields();
    if (type === "edit") {
      refetchGetdocument()
        .then((res) => {
          setDocgroups(res.data?.docgroup?.id);
          setFileListUploaded(res?.data?.files || []);
          form.setFieldsValue({
            ...res.data,
            dueDate: res.data?.dueDate ? moment(res.data?.dueDate) : null,
            status: res.data.status ? res.data.status.toString() : undefined,
            docgroup: res.data?.docgroup?.id,
            doctype: res.data?.doctype?.id,
            emailBCC:
              res.data.emailBCC?.split(",")?.filter((item) => item.length) ||
              [],
            emailCC:
              res.data.emailCC?.split(",")?.filter((item) => item.length) || [],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      form.setFieldsValue({
        ...data,
        status: data?.status ? data?.status.toString() : undefined,
        docgroup: data?.docgroup?.id,
        doctype: data?.doctype?.id,
        emailBCC: data?.emailBCC?.split(",") || [],
        emailCC: data?.emailCC?.split(",") || [],
      });
    }
    // setDocgroups(data?.docgroup?.id)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // eslint-disable-next-line no-unused-vars
  const handlePublish = () => {
    const values = form.getFieldsValue();
    values.id = data.id;
    values.publish = true;
    values.emailCC = values?.emailCC?.join(",") || undefined;
    values.emailBCC = values?.emailBCC?.join(",") || undefined;
    values.attachFiles =
      values?.attachFiles?.map((item) => item.originFileObj) || [];

    saveData(type, values);
  };

  const findExistType = () => {
    return (
      dataGetDocType?.find(({ id }) => id === form.getFieldValue("doctype")) ||
      {}
    );
  };

  const props = {
    // eslint-disable-next-line no-shadow
    beforeUpload: (file) => {
      const existType = findExistType();
      const extensions = existType.extensions || [];
      const { maxSize } = existType; // Kb
      const newObject = validateFile(file, extensions, maxSize);
      if (newObject !== false) {
        return false;
      }
      return Upload.LIST_IGNORE;
    },
    multiple: true,
    accept: (type !== "add" ? findExistType()?.extensions : [])
      ?.map((item) => `.${item}`)
      .join(","),
  };

  const onFinish = (values) => {
    if (docgroups) {
      values.docgroup = docgroups;
      values.id = data.id;
      values.publish = false;
      values.emailCC = values?.emailCC?.join(",") || undefined;
      values.emailBCC = values?.emailBCC?.join(",") || undefined;
      values.attachFiles =
        values?.attachFiles?.map((item) => item.originFileObj) || [];
      values.dueDate = values?.dueDate
        ? moment(values?.dueDate._d).toISOString()
        : undefined;
      saveData(type, values);
    } else {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn một nhóm văn bản cụ thể",
      });
    }

    // saveData({ ...values })
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleValidate = () => form.validateFields();
  //  {
  //   // eslint-disable-next-line no-unused-vars
  //   form.validateFields().then((_, err) => {
  //     console.log(err)
  //   })
  // }

  const handlerefetchDataDocument = () => {
    refetchDataDocument();
    handleOk();
  };

  useEffect(() => {
    if (isSuccess) {
      handleOk();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (textEmail && textEmail.length > 0) refetchCollectionEmail();
  }, [textEmail]);

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
        data?.status === DB_DOCUMENT_STATUS_NEW &&
        user.id === data.userId && (
          <Tooltip title="Sửa">
            <Button
              disabled={
                !(
                  data?.status === DB_DOCUMENT_STATUS_NEW &&
                  user.id === data.userId
                )
              }
              onClick={showModal}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
        )
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
            style={{ marginBottom: 0, width: "100%" }}
            label="Loại văn bản:"
            name="doctype"
            rules={[
              {
                required: true,
                message: "Loại văn bản không được bỏ trống",
              },
            ]}
          >
            <Select
              disabled={type === "edit"}
              maxTagCount={1}
              allowClear
              placeholder="Loại văn bản"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              onChange={(value) => {
                if (value) {
                  setIsDoctypeSelected(true);
                } else {
                  setIsDoctypeSelected(false);
                }
              }}
            >
              <Select.OptGroup key="doctype" label="Loại văn bản">
                {dataGetDocType?.length
                  ? dataGetDocType.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>
            </Select>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Nhóm văn bản:"
            name="docgroup"
            rules={[
              {
                required: true,
                message: "Nhóm văn bản không được bỏ trống",
              },
              // () => ({
              //   validator(_, value) {
              //     // console.log(value)
              //     if (docgroups || !value.includes(';')) {
              //       return Promise.resolve()
              //     }
              //     // if (!value || (value.includes(';') || value.includes())) {
              //     // }
              //     return Promise.reject(new Error('Vui lòng chọn 1 nhóm văn bản'))
              //   },
              // }),
            ]}
          >
            <TreeSelect {...tProps} />
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
                  ListFileData={fileListUploaded}
                  documentId={data.id}
                  showModal={showModal}
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
                disabled={!isDoctypeSelected && !data.id}
                icon={<UploadOutlined />}
              >
                Tải lên
              </Button>
            </Upload>
          </Form.Item>
          {user.role.includes("A1") && (
            <Form.Item
              style={{ marginBottom: 0 }}
              label="Hạn hoàn thành"
              name="dueDate"
            >
              <DatePicker format={FORMAT_DATE} style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Divider />
          <Form.Item
            style={{ marginBottom: 0 }}
            wrapperCol={{ offset: 10, span: 10 }}
          >
            <ListEmail formDocument={form} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Email CC"
            name="emailCC"
            rules={EmailCollectionRule.cc}
          >
            <Select
              mode="tags"
              style={{
                width: "100%",
              }}
              placeholder="Email cc"
              allowClear
              showSearch
              onSearch={(value) => setTextEmail(value)}
            >
              {" "}
              {getAllCollectionEmail?.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}{" "}
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Email BCC"
            name="emailBCC"
            rules={EmailCollectionRule.cc}
          >
            <Select
              mode="tags"
              // value={dataCCBCC.bcc}
              // onChange={e => setDataCCBCC({ ...dataCCBCC, bcc: [...dataCCBCC.bcc, e] })}
              style={{
                width: "100%",
              }}
              placeholder="Email bcc"
              allowClear
              showSearch
              onSearch={(value) => setTextEmail(value)}
            >
              {" "}
              {getAllCollectionEmail?.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}{" "}
            </Select>
          </Form.Item>
          <Divider />
          <Form.Item {...tailLayout} style={{ marginBottom: "0px" }}>
            <Row style={{ justifyContent: "flex-end" }}>
              {user.role.includes("A1") && type === "add" && (
                <Col>
                  <PublishForm
                    dataDocGroup={docgroups}
                    refetchData={handlerefetchDataDocument}
                    handleValidate={handleValidate}
                    type="form"
                    style={{}}
                  />
                </Col>
              )}
              {user.role.includes("A1") === true ? (
                <Col>
                  <Button
                    className="ml-2"
                    loading={loadingSave}
                    icon={<i className="fe fe-save mr-2" />}
                    type="primary"
                    htmlType="submit"
                  >
                    Lưu
                  </Button>
                </Col>
              ) : (
                user.role.includes("USER") && (
                  <Col>
                    <Button
                      className="ml-2"
                      loading={loadingSave}
                      icon={<i className="fe fe-save mr-2" />}
                      type="primary"
                      htmlType="submit"
                    >
                      Gửi tới A1
                    </Button>
                  </Col>
                )
              )}
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DocumentForm;
