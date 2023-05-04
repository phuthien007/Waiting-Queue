import { Button, Modal, Row } from "antd";
import React, { Component } from "react";
import QrReader from "react-qr-scanner";

const delay: number = 500;
const previewStyle = {
  height: "100%",
  width: "100%",
};
const QrCodeComponent: React.FC = () => {
  const [result, setResult] = React.useState<string>("");
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const showModal = () => {
    setIsOpenModal(true);
  };

  const handleOk = () => {
    setIsOpenModal(false);
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handleScan = (data: any) => {
    if (data) {
      setResult(data?.text);
    }
  };
  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div>
      <Button
        type="primary"
        className="mr-2"
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
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
        {/* Link to result text */}
        {result?.length > 0 && (
          <Row justify="center">
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
