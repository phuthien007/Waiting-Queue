import { QrcodeOutlined } from "@ant-design/icons";
import { useQueuesControllerGetQrCode } from "@api/waitingQueue";
import { Button, Card, Col, Drawer, Row, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import html2canvas from "html2canvas";
import _ from "lodash";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const QrCodeRender: React.FC = () => {
  const { queueId } = useParams();

  const [isQrCodeOpen, setIsQrCodeOpen] = React.useState<boolean>(false);
  const [valueUrl, setValueUrl] = React.useState<string>(
    "https://picturesofpeoplescanningqrcodes.tumblr.com/"
  ); // [1

  const { refetch } = useQueuesControllerGetQrCode(_.toSafeInteger(queueId), {
    query: {
      enabled: false,
    },
  });

  const showModalQrCode = () => {
    setIsQrCodeOpen(true);
  };

  const handleCancelQrCode = () => {
    setIsQrCodeOpen(false);
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById("qr-gen");

    html2canvas(qrCodeElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  useEffect(() => {
    refetch().then((res) => {
      if (res) {
        setValueUrl(res.data);
      }
    });
  }, []);

  return (
    <>
      <Button
        onClick={showModalQrCode}
        type="primary"
        // style={{ width: "100%" }}
        // icon={<QrcodeOutlined />}
      >
        Hiện mã QRCode
      </Button>
      <Drawer
        width={"100%"}
        title="Mã QRCode"
        onClose={handleCancelQrCode}
        destroyOnClose
        open={isQrCodeOpen}
        placement="right"
        closable
        maskClosable
        closeIcon={
          <i
            className="fe fe-x"
            style={{ color: "red", fontSize: 24, float: "right" }}
          />
        }
      >
        <Row justify="center" style={{ width: "100% !important" }}>
          <Col
            xs={0}
            sm={0}
            md={24}
            lg={24}
            xl={24}
            xxl={24}
            style={{ width: "100% !important" }}
          >
            <Card>
              <Row justify="center">
                <QRCodeCanvas
                  id="qr-gen"
                  value={valueUrl}
                  size={420}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={true}
                />
              </Row>
              <Row
                justify="center"
                // gutter={[20, 20]}
                style={{ marginTop: "20px" }}
              >
                <Button onClick={downloadQRCode} type="primary">
                  Tải xuống
                </Button>
              </Row>
            </Card>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={0}
            xl={0}
            lg={0}
            xxl={0}
            style={{ width: "100% !important" }}
          >
            <Card style={{ width: "100% !important" }}>
              <Row justify="center" style={{ width: "100% !important" }}>
                <QRCodeCanvas
                  id="qr-gen"
                  value={valueUrl}
                  style={{ width: "100%", height: "100%" }}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={true}
                />
              </Row>
              <Row
                justify="center"
                gutter={[20, 20]}
                style={{ marginTop: "20px" }}
              >
                <Button onClick={downloadQRCode} type="primary">
                  Tải xuống
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default QrCodeRender;
