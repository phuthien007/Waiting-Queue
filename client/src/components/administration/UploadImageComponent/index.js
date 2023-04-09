/* eslint-disable no-shadow */
import { PlusOutlined } from "@ant-design/icons";
import { useDelteSlide, useEditSlideConfig } from "@api/manage";
import { Modal, notification, Upload } from "antd";
import { useEffect, useState } from "react";
import { FILE_EXPORT, validateFile } from "services/utils/File";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const UploadImageComponent = ({ data, getSlideConfig }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const { mutateAsync: deleteImage } = useDelteSlide();

  const { mutateAsync: addImage } = useEditSlideConfig();

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    // filter item in array data which item is not have id in newFileList

    const newArrDelete = data?.filter(
      (item) => !newFileList.map((fileIt) => fileIt.uid).includes(item.id)
    );
    const newArrAdd = newFileList
      .filter((item) => !data?.map((fileIt) => fileIt.id).includes(item.uid))
      .map((newF) => newF.originFileObj);
    newArrDelete.forEach((item) => {
      deleteImage({ id: item.id })
        .then(() => {
          notification.success({
            message: "Thành công",
            description: `Bạn đã xóa ảnh: ${item.name} thành công`,
          });
          setFileList(newFileList);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getSlideConfig();
        });
    });

    newArrAdd.forEach((item) => {
      addImage({
        data: {
          attachFiles: newArrAdd,
        },
      })
        .then(() => {
          notification.success({
            message: "Thành công",
            description: `Bạn đã thêm ảnh: ${item.name} thành công`,
          });
          setFileList(newFileList);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          getSlideConfig();
        });
    });
  };

  useEffect(() => {
    if (data) {
      setFileList(
        data?.map((item) => ({
          uid: item.id,
          name: item.name,
          status: "done",
          url: FILE_EXPORT["slide-resource"] + item.downloadUrl,
        }))
      );
    }
  }, [data]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        beforeUpload={(file) => {
          const existType = {
            maxSize: 5e6, // 5 MB
          };
          const extensions = existType.extensions || [];
          const { maxSize } = existType; // Kb
          const newObject = validateFile(file, extensions, maxSize);
          if (newObject !== false) {
            return false;
          }
          return Upload.LIST_IGNORE;
        }}
        listType="picture-card"
        fileList={fileList}
        // multiple
        accept="image/*"
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 12 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
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
    </>
  );
};

export default UploadImageComponent;
