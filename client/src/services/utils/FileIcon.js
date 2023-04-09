import {
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FileImageOutlined
} from "@ant-design/icons";

const FileIcon = (extension) => {
  if (extension.extension === "pdf")
    return <FilePdfOutlined style={{ fontSize: "4rem" }} />;
  if (extension.extension === "docx")
    return <FileWordOutlined style={{ fontSize: "4rem" }} />;
  if (extension.extension === "txt")
    return <FileTextOutlined style={{ fontSize: "4rem" }} />;
  if (
    extension.extension === "zip" ||
    extension.extension === "rar" ||
    extension.extension === "7z"
  )
    return <FileZipOutlined style={{ fontSize: "4rem" }} />;
  if (extension.extension === "xlsx")
    return <FileExcelOutlined style={{ fontSize: "4rem" }} />;
  return <FileImageOutlined style={{ fontSize: "4rem" }} />;
};

export default FileIcon;
