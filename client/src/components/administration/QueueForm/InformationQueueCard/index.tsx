import { QrcodeOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Row } from "antd";
import React from "react";

const InformationQueueCard = () => {
  return (
    <Descriptions
      title={
        <Row justify="space-between">
          <Col span={10}>Chi tiết hàng đợi</Col>
          <Col span={10}>
            <Button type="primary" icon={<QrcodeOutlined />}>
              Hiện mã QRCode
            </Button>
          </Col>
        </Row>
      }
      column={{
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 3,
        sm: 2,
        xs: 1,
      }}
    >
      <Descriptions.Item label="Tên hàng đợi">Hàng đợi A</Descriptions.Item>
      <Descriptions.Item label="Địa điểm">1810000000</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        Hangzhou, Zhejiang
      </Descriptions.Item>
      <Descriptions.Item label="Mô tả">empty</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </Descriptions.Item>
    </Descriptions>
  );
};

export default InformationQueueCard;
