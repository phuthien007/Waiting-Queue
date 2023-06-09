import { Button, Col, Modal, Row, Space, Typography } from "antd";
import React, { Component } from "react";
import { QrReader } from "react-qr-reader";

const delay: number = 500;
const previewStyle = {
  height: "100%",
  width: "100%",
};

const frontFacingConstraints = {
  facingMode: "user",
  frameRate: { ideal: 30, max: 60 },
};

const rearFacingConstraints = {
  facingMode: "environment",
  frameRate: { ideal: 30, max: 60 },
};

const QrCodeComponent: React.FC = () => {
  const [result, setResult] = React.useState<string>("");
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [facingMode, setFacingMode] = React.useState<"user" | "environment">(
    "environment"
  );
  const showModal = () => {
    setIsOpenModal(true);
    setResult("");
  };

  const handleOk = () => {
    setIsOpenModal(false);
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };
  return (
    <div>
      <Button
        type="primary"
        icon={<i className="fa fa-camera mr-2" />}
        onClick={showModal}
      >
        Mở camera
      </Button>
      <Modal
        footer={null}
        title="Quét mã QR"
        destroyOnClose
        open={isOpenModal}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Button
          type="primary"
          onClick={() => {
            if (facingMode === "environment") {
              setFacingMode("user");
            } else {
              setFacingMode("environment");
            }
          }}
          icon={<i className="fa fa-camera mr-1 mt-1 mb-1" />}
        >
          Đổi camera
        </Button>
        <QrReader
          videoStyle={previewStyle}
          onResult={(result, error) => {
            if (result && result.getText()) {
              setResult(result.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={
            facingMode === "environment"
              ? rearFacingConstraints
              : frontFacingConstraints
          }
          scanDelay={delay}
        />
        {/* Link to result text */}
        {result?.length > 0 && (
          <Row justify="center" className="mt-2">
            <Col span={24} className="text-center">
              <Typography.Text strong>Đã quét thành công: </Typography.Text>
              <Typography.Text>{result}</Typography.Text>
            </Col>
            <Button type="primary" href={result} target="_self">
              Đi đến kết quả
            </Button>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default QrCodeComponent;
