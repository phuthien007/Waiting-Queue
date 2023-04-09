import { Button, List, Modal, Tooltip } from "antd";
import { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { useGetPublishFilesDocument } from "@api/document";
import { useEncryptUserInfo } from "@api/file";
import { FILE_EXPORT } from "services/utils/File";
import FilePreview from "components/files/FilePreview";

const ListFiles = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    refetch: getAllListFile,
    data,
    isFetching,
  } = useGetPublishFilesDocument(id, {
    query: { enabled: false },
  });

  const { refetch: getKeyDownloadFile, isFetching: isEncrypting } =
    useEncryptUserInfo({
      query: { enabled: false },
    });

  const showModal = () => {
    getAllListFile();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Tải xuống">
        <Button
          shape="circle"
          onClick={showModal}
          type="primary"
          icon={<DownloadOutlined />}
        />
      </Tooltip>

      <Modal
        title="DANH SÁCH FILE"
        open={isModalOpen}
        onOk={handleOk}
        cancelText="Đóng"
        footer={null}
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
                title={`${item.name}`}
                // description={item.publish ? 'Đã xuất bản' : 'Chưa xuất bản'}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ListFiles;
