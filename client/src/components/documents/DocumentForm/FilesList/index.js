import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDeleteFileDocument } from "@api/document";
import { useEncryptUserInfo } from "@api/file";
import {
  Button,
  Card,
  Col,
  Divider,
  notification,
  Popconfirm,
  Row,
  Tooltip,
} from "antd";
import FilePreview from "components/files/FilePreview";
import { useSelector } from "react-redux";
import {
  DB_DOCUMENT_STATUS_CONFIRMED,
  DB_DOCUMENT_STATUS_NEW,
  DB_DOCUMENT_STATUS_RELEASE,
} from "services/utils/constants";
import { domain, FILE_EXPORT } from "services/utils/File";
import FileIcon from "services/utils/FileIcon";
import { selectUser } from "store/userSlice";
import styles from "./style.module.scss";

const FileList = ({
  listChooseFile,
  setListChooseFile,
  ListFileData,
  documentId,
  showModal,
  type,
  comment,
  dataFile,
  setDataFile,
  statusDocument,
}) => {
  const { isLoading: isLoadingDelete, mutateAsync: deleteFileDocumentById } =
    useDeleteFileDocument();
  const handleDeleteFile = (fileId) => {
    deleteFileDocumentById({ id: documentId, fileId })
      .then(() => {
        notification.success({
          message: "Thành công",
          description: "Bạn đã xóa thành công file đính kèm",
        });
        showModal();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const { role } = useSelector(selectUser);
  const handleRemoveFile = (fileId) => {
    setDataFile(dataFile.filter((item) => item.id !== fileId));
  };

  const { refetch: getKeyDownLoadFile } = useEncryptUserInfo({
    query: { enabled: false },
  });
  const handleDownload = (item) => {
    getKeyDownLoadFile()
      .then((res) => {
        const url = comment
          ? `${domain + item.downloadUrl}?key=${encodeURIComponent(res.data)}`
          : `${domain + item.downloadUrl}?key=${encodeURIComponent(res.data)}`;
        window.open(url, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClickFile = (item) => {
    if (
      role.includes("A1") &&
      (statusDocument === DB_DOCUMENT_STATUS_NEW ||
        statusDocument === DB_DOCUMENT_STATUS_CONFIRMED)
    ) {
      if (listChooseFile?.includes(item)) {
        setListChooseFile(listChooseFile.filter((file) => file.id !== item.id));
      } else {
        setListChooseFile([...listChooseFile, item]);
      }
    }
  };

  if (type && type === "detail")
    return (
      <Row>
        {ListFileData?.map((item) => {
          const isActive = listChooseFile?.includes(item);

          return (
            <div key={item.id}>
              <Col>
                <Card
                  className={`mr-3 mb-3 ${isActive ? styles.selected : ""}`}
                  style={{
                    width: "150px",
                  }}
                  size="small"
                  title={
                    item.name.length > 14 ? (
                      <Tooltip placement="topLeft" title={item.name}>
                        {item.name}
                      </Tooltip>
                    ) : (
                      item.name
                    )
                  }
                  about={item.name}
                  actions={[
                    <Tooltip title="Tải xuống">
                      <Button
                        title={`Tải xuống: ${item.name}`}
                        type="link"
                        onClick={() => handleDownload(item)}
                      >
                        <i
                          className="fe fe-download"
                          style={{ fontSize: "1.2rem" }}
                        />
                      </Button>
                    </Tooltip>,
                    <FilePreview
                      id={item.id}
                      item={item}
                      style={{
                        display:
                          item.size <
                            1024 * process.env.REACT_APP_MAXSIZEPREVIEW || 0
                            ? "block"
                            : "none",
                      }}
                    />,
                  ]}
                >
                  <Row className="justify-content-sm-center">
                    <Button
                      type="link"
                      onClick={() => handleClickFile(item)}
                      style={{ height: "60px" }}
                    >
                      <FileIcon extension={item.extension} />
                    </Button>
                  </Row>
                </Card>
              </Col>
            </div>
          );
        })}
      </Row>
    );

  if (type && type === "publish") {
    return dataFile?.map((item) => {
      return (
        <div key={item.id}>
          <Row style={{ width: "100%" }}>
            <Col span={17}>
              <p style={{ marginTop: "5px" }}>
                <i className="fe fe-file mr-2" />
                {item.name}
              </p>
            </Col>
            <Col span={7}>
              <Row className="justify-content-end">
                {item.size <
                  (1024 * process.env.REACT_APP_MAXSIZEPREVIEW && (
                    <FilePreview id={item.id} item={item} />
                  ))}
                <Tooltip title="Tải xuống">
                  <Button
                    type="link"
                    onClick={() => {
                      getKeyDownLoadFile()
                        .then((res) => {
                          const url = `${
                            FILE_EXPORT["file-document"] + item.id
                          }?key=${encodeURIComponent(res.data)}`;
                          window.open(url, "_blank");
                        })
                        .catch((err) => {
                          console.log("err", err);
                        });
                    }}
                  >
                    <i className="fe fe-download " />
                  </Button>
                </Tooltip>
                <Popconfirm
                  okButtonProps={{
                    loading: isLoadingDelete,
                  }}
                  onConfirm={() => handleRemoveFile(item.id)}
                  title="XÁC NHẬN XÓA"
                  okText="Xóa"
                  cancelText="Hủy"
                  icon={
                    <QuestionCircleOutlined
                      style={{
                        color: "red",
                      }}
                    />
                  }
                >
                  <Tooltip title="Xóa">
                    <Button type="link" danger>
                      <i className="fe fe-trash " />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </Row>
            </Col>
          </Row>
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        </div>
      );
    });
  }
  return ListFileData?.map((item) => {
    return (
      <div key={item.id}>
        <Row style={{ width: "100%" }}>
          <Col span={17}>
            <p style={{ marginTop: "5px" }}>
              <i className="fe fe-file mr-2" />
              {item.name}
            </p>
          </Col>
          <Col span={7}>
            <Row className="justify-content-end">
              {item.size <
                (1024 * process.env.REACT_APP_MAXSIZEPREVIEW && (
                  <FilePreview id={item.id} item={item} />
                ))}
              <Tooltip title="Tải xuống">
                <Button
                  type="link"
                  onClick={() => {
                    getKeyDownLoadFile()
                      .then((res) => {
                        const url = `${
                          FILE_EXPORT["file-document"] + item.id
                        }?key=${encodeURIComponent(res.data)}`;
                        window.open(url, "_blank");
                      })
                      .catch((err) => {
                        console.log("err", err);
                      });
                  }}
                >
                  <i className="fe fe-download " />
                </Button>
              </Tooltip>
              <Popconfirm
                okButtonProps={{
                  loading: isLoadingDelete,
                }}
                onConfirm={() => handleDeleteFile(item.id)}
                title="XÁC NHẬN XÓA"
                okText="Xóa"
                cancelText="Hủy"
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: "red",
                    }}
                  />
                }
              >
                <Tooltip title="Xóa">
                  <Button type="link" danger>
                    <i className="fe fe-trash " />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </Row>
          </Col>
        </Row>
        <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      </div>
    );
  });
};

export default FileList;
