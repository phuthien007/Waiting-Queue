import { DownloadOutlined } from "@ant-design/icons";
import { useEncryptUserInfo } from "@api/file";
import { Button, Tooltip } from "antd";
import { FILE_EXPORT } from "services/utils/File";

const FileDownload = ({ id }) => {
  const { refetch: getKeyDownloadFile } = useEncryptUserInfo({
    query: { enabled: false },
  });

  return (
    <Tooltip title="Tải xuống">
      <Button
        shape="circle"
        // loading={isLoading}
        onClick={() => {
          getKeyDownloadFile()
            .then((res) => {
              const url = `${
                FILE_EXPORT["file-resource"]
              }${id}?key=${encodeURIComponent(res.data)}`;
              window.open(url, "_blank");
            })
            .catch((err) => console.log(err));
        }}
        icon={<DownloadOutlined />}
      />
    </Tooltip>
  );
};

export default FileDownload;
