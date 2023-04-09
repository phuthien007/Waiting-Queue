/* eslint-disable no-unused-vars */
import { QuestionCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { useDeleteTicketAttachFiles } from "@api/eticket";
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
import { domain } from "services/utils/File";

const FileList = ({
  ListFileData,
  documentId,
  showModal,
  type,
  comment,
  keyLoadFirst,
}) => {
  const { refetch: getKeyDownLoadFile } = useEncryptUserInfo({
    query: { enabled: false },
  });
  const { isLoading: isLoadingDelete, mutateAsync: deleteFileTicketById } =
    useDeleteTicketAttachFiles();
  const handleDeleteFile = (fileId) => {
    deleteFileTicketById({ id: fileId })
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

  if (type && type === "detail")
    return (
      <Row>
        {ListFileData?.map((item) => {
          return (
            <div key={item.id}>
              <Col>
                <Card
                  className="mr-3 mb-3"
                  style={{ width: "150px" }}
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
                    <FilePreview type="ticket" id={item.id} item={item} />,
                  ]}
                >
                  <Row className="justify-content-sm-center">
                    <Button
                      title={`Tải xuống: ${item.name}`}
                      type="link"
                      onClick={() => handleDownload(item)}
                      style={{ height: "60px" }}
                    >
                      <FileImageOutlined style={{ fontSize: "4rem" }} />
                    </Button>
                  </Row>
                </Card>
              </Col>
            </div>
          );
        })}
      </Row>
    );

  return ListFileData?.map((item) => {
    return (
      <div key={item.id}>
        <Row>
          <Col span={15}>
            <p style={{ marginTop: "5px" }}>
              <i className="fe fe-file mr-2" />
              {item.name}
            </p>
          </Col>
          <Col span={9}>
            <Row className="justify-content-end">
              <FilePreview type="ticket" id={item.id} item={item} />
              <Tooltip title="Tải xuống">
                <Button
                  type="link"
                  onClick={() => {
                    getKeyDownLoadFile()
                      .then((res) => {
                        const url = `${
                          domain + item.downloadUrl
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
