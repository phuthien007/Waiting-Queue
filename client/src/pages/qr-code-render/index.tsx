import { QrcodeOutlined } from "@ant-design/icons";
import { useQueuesControllerGetQrCode } from "@api/waitingQueue";
import { Button, Card, Col, Drawer, Row, Typography } from "antd";
import Title from "antd/lib/skeleton/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import html2canvas from "html2canvas";
import _ from "lodash";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

let refetchInterval;

// type Props = {
//   isDynamic: boolean;
//   name: string;
// };

const QrCodeRenderPage: React.FC = () => {
  const { queueCode } = useParams();
  const { state } = useLocation();
  console.log("sta", state);
  const { isDynamic, name } = state;
  const [valueUrl, setValueUrl] = React.useState<string>(
    "https://picturesofpeoplescanningqrcodes.tumblr.com/"
  ); // [1

  const { refetch } = useQueuesControllerGetQrCode(queueCode, {
    query: {
      enabled: false,
    },
  });

  const showModalQrCode = () => {
    setIsQrCodeOpen(true);

    refetch().then((res) => {
      if (res) {
        setValueUrl(res.data);
      }
    });
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
    //
    if (isDynamic) {
      refetchInterval = setInterval(() => {
        refetch().then((res) => {
          if (res) {
            setValueUrl(res.data);
          }
        });
      }, 30000);
    } else {
      clearInterval(refetchInterval);
    }
    return () => clearInterval(refetchInterval);
  }, [isDynamic]);

  return (
    <>
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
              <b>{`Hàng đợi: ${name} `}</b>
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
                size={512}
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
    </>
  );
};

export default QrCodeRenderPage;
