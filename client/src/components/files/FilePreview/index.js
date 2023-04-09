import { useEffect, useMemo, useState } from "react";
import { Button, Image, Modal, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import mime from "mime";
import { useEncryptUserInfo } from "@api/file";
import { CONVERTIBLE_EXTENDSIONS, FILE_EXPORT } from "services/utils/File";
import { useGetFileById } from "@api/manage";
// import MyDocument from "./PdfReader";

// eslint-disable-next-line no-unused-vars
const FilePreview = ({ id, style, type, item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uri, setUri] = useState("");
  const { refetch: getKeyDownloadFile } = useEncryptUserInfo({
    query: { enabled: false },
  });

  const showModal = () => {
    getKeyDownloadFile()
      .then((res) => {
        const url = `${FILE_EXPORT["file-resource"]}${
          type ? "ticketAttachFile/" : ""
        }${id}${!type ? "/preview" : ""}?key=${encodeURIComponent(res.data)}`;
        setUri(url);
        setIsModalOpen(true);

        if (!isImageFile) window.open(url, "_blank");
      })
      .catch((err) => console.log(err));
  };

  const isImageFile = useMemo(() => {
    return item && item.extension && mime.getType(item.extension)
      ? mime.getType(item.extension).startsWith("image/")
      : false;
  }, [item]);

  const isConvertibleFile = useMemo(() => {
    return (
      item &&
      item.extension &&
      CONVERTIBLE_EXTENDSIONS.includes(item.extension.toLowerCase())
    );
  }, [item]);

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <>
      <Tooltip
        title={
          isImageFile || isConvertibleFile
            ? "Xem trên trình duyệt"
            : "Không thể xem trước file này"
        }
      >
        <Button
          shape="circle"
          style={{ color: "blue", border: "none" }}
          onClick={showModal}
          icon={<EyeOutlined />}
          disabled={!isImageFile && !isConvertibleFile}
        />
      </Tooltip>
      {isImageFile ? (
        <Image
          width={1}
          height={1}
          hidden
          style={{ display: "none" }}
          src={uri}
          preview={{
            visible: isModalOpen,
            // scaleStep,
            src: uri,
            onVisibleChange: (value) => {
              setIsModalOpen(value);
            },
          }}
        />
      ) : // <Modal
      //   width="100%"
      //   style={{
      //     top: 10,
      //     height: "110vh",
      //   }}
      //   footer={null}
      //   title="Xem chi tiết"
      //   open={isModalOpen}
      //   onOk={handleOk}
      //   onCancel={handleCancel}
      //   bodyStyle={{ padding: 0 }}
      // >
      //   {/* <PDFViewer style={{ width: '100%', height: '75vh' }}> */}
      //   <MyDocument uri={uri} />
      //   {/* </PDFViewer> */}
      // </Modal>
      null}
    </>
  );
};

export default FilePreview;
