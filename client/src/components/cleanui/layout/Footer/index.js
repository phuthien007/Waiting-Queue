import { Button, Col, Row } from "antd";
import style from "./style.module.scss";

function downloadFile(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = url.split("/").pop();
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Usage
const fileUrl =
  "https://github.com/phuthien007/WaitingQueue-Mobile/raw/master/app-release.apk";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <Row justify="center" className="mb-2" gutter={[12, 12]}>
          <Col>
            <Button
              onClick={() => {
                downloadFile(fileUrl);
              }}
              shape="round"
              icon={
                <i
                  className="fa fa-android mr-2"
                  style={{ color: "white", fontSize: 22 }}
                />
              }
              style={{
                backgroundColor: "green",
                color: "white",
                borderColor: "green",
              }}
            >
              Tải ứng dụng
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                alert("Đang phát triển");
              }}
              shape="round"
              icon={
                <i
                  className="fa fa-apple mr-2"
                  style={{ color: "white", fontSize: 22 }}
                />
              }
              style={{
                backgroundColor: "#4b7cf3",
                color: "white",
                borderColor: "#4b7cf3",
              }}
            >
              Tải ứng dụng
            </Button>
          </Col>
        </Row>
        <p className="font-weight-bold">
          {/* icon copyright */}
          2023
          <span className="mr-1 ml-1">
            <i className="fa fa-copyright" />
          </span>
          Copyright - TRẦN THIỆN PHÚ | OTIS TRAN | WEB DEVELOPER
        </p>
        <p>Tel: 0941556192</p>
      </div>
    </div>
  );
};

export default Footer;
