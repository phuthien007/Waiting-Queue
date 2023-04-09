import {
  Button,
  Checkbox,
  Divider,
  List,
  Modal,
  notification,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import {
  useGetPublishFilesDocument,
  useCheckSendDocument,
} from "@api/document";
import { useEncryptUserInfo } from "@api/file";
import { FILE_EXPORT } from "services/utils/File";
import FilePreview from "components/files/FilePreview";
import { selectUser } from "store/userSlice";
import { useSelector } from "react-redux";
import {
  DB_DOCUMENT_STATUS_RELEASE,
  DB_DOCUMENT_STATUS_REVOKED,
  FORMAT_DATE,
} from "services/utils/constants";

const ListFilesDOffice = ({ record, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector(selectUser);
  const {
    refetch: getAllListFile,
    data,
    isFetching,
  } = useGetPublishFilesDocument(record?.id, {
    query: { enabled: false },
  });
  const [checkDocumentSendToDOffice, setCkeckDocumentSendToDOffice] = useState(
    []
  );

  const [sendWithLink, setSendWithLink] = useState(false);

  const { refetch: getKeyDownloadFile, isFetching: isEncrypting } =
    useEncryptUserInfo({
      query: { enabled: false },
    });
  // check send to Doffice
  const { isLoading: loadingCheckSendTo, mutateAsync: checkSendTo } =
    useCheckSendDocument();

  const handleCheckSendTo = async (id) => {
    checkSendTo({
      id,
      data: {
        attachFileIds: checkDocumentSendToDOffice,
        isLink: sendWithLink,
      },
    })
      .then(() => {
        if (user.role.includes("DOC_KEEPER")) {
          notification.success({
            message: "Thành công",
          });
          refetch();
          setIsModalOpen(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const showModal = () => {
    getAllListFile();
    setSendWithLink(false);
    setCkeckDocumentSendToDOffice([]);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // validate check send to Doffice
    if (checkDocumentSendToDOffice.length === 0) {
      notification.error({
        message: "Vui lòng chọn tài liệu cần gửi",
      });
    } else {
      let totalSize = 0;
      let havePdf = false;
      data
        .filter((item) => checkDocumentSendToDOffice.includes(item.id))
        .forEach((item) => {
          totalSize += item.size;
          if (item.extension === "pdf") {
            havePdf = true;
          }
        });

      // check total size less than 100MB
      if (totalSize > 1 * 1024 * 100) {
        notification.error({
          message: "Tổng dung lượng tài liệu không được vượt quá 100MB",
        });
      }
      // check have pdf
      else if (!havePdf) {
        notification.error({
          message: "Tài liệu phải có ít nhất 1 file pdf",
        });
      } else {
        // check send to Doffice
        handleCheckSendTo(record.id);
      }
    }
  };
  const handleRemoveCheckSendTo = (id) => {
    checkSendTo({
      id,
      data: {
        attachFileIds: [],
        isLink: false,
      },
    })
      .then(() => {
        if (user.role.includes("DOC_KEEPER")) {
          notification.success({
            message: "Thành công",
          });
          refetch();
          setIsModalOpen(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {user.role.includes("DOC_KEEPER") &&
        user.role.includes("A1") &&
        record?.status === DB_DOCUMENT_STATUS_RELEASE &&
        (!record.isSendToDOffice && !record.sendToDOfficeDate ? (
          <Tooltip title="Đánh dấu văn bản gửi lên D-Office">
            <Button
              loading={loadingCheckSendTo}
              onClick={() => showModal()}
              shape="circle"
              icon={<i className="fa fa-cloud-upload" />}
              type="primary"
            />
          </Tooltip>
        ) : (
          !record.sendToDOfficeDate && (
            <Tooltip title="Hủy đánh dấu văn bản gửi lên D-Office">
              <Button
                loading={loadingCheckSendTo}
                onClick={() => handleRemoveCheckSendTo(record.id)}
                shape="circle"
                danger
                icon={<i className="fa fa-cloud-download" />}
              />
            </Tooltip>
          )
        ))}

      <Modal
        title="DANH SÁCH FILE"
        open={isModalOpen}
        onOk={handleOk}
        closable
        destroyOnClose
        cancelText="Đóng"
        okText="Lưu"
        onCancel={handleCancel}
      >
        <List
          loading={isFetching}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tooltip title="Tải về máy">
                  <Button
                    loading={isEncrypting}
                    shape="circle"
                    onClick={() => {
                      getKeyDownloadFile().then((res) => {
                        const url = `${
                          FILE_EXPORT["file-document-publish"] + item.id
                        }?key=${encodeURIComponent(res.data)}`;
                        window.open(url, "_blank");
                      });
                    }}
                    type="primary"
                    icon={<DownloadOutlined />}
                  />
                </Tooltip>,
                <FilePreview id={item.id} item={item} />,
              ]}
            >
              <List.Item.Meta
                title={
                  <Tooltip title="Đánh dấu văn bản đẩy lên">
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCkeckDocumentSendToDOffice([
                            ...checkDocumentSendToDOffice,
                            item?.id,
                          ]);
                        } else {
                          setCkeckDocumentSendToDOffice(
                            checkDocumentSendToDOffice.filter(
                              (i) => i !== item?.id
                            )
                          );
                        }
                      }}
                      key={item.id}
                    >
                      {item.name}
                    </Checkbox>
                  </Tooltip>
                }
                // description={item.publish ? 'Đã xuất bản' : 'Chưa xuất bản'}
              />
            </List.Item>
          )}
        />
        <Divider />
        <Checkbox onChange={(e) => setSendWithLink(e.target.checked)}>
          <b>Có gửi kèm link trích yếu không?</b>
        </Checkbox>
      </Modal>
    </>
  );
};

export default ListFilesDOffice;
