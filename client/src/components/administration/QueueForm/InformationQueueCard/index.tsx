import { QrcodeOutlined } from "@ant-design/icons";
import { QueueDto } from "@api/waitingQueue.schemas";
import { Button, Col, Descriptions, Row } from "antd";
import React from "react";
import { StatusQueueRender } from "services/utils/format";

type Props = {
  data: QueueDto;
};

const InformationQueueCard: React.FC<Props> = ({ data }) => {
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
        md: 2,
        sm: 2,
        xs: 1,
      }}
    >
      <Descriptions.Item label="Tên hàng đợi">{data?.name}</Descriptions.Item>
      <Descriptions.Item label="Địa điểm">{data?.coord}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">
        {StatusQueueRender(data?.status)}
      </Descriptions.Item>
      <Descriptions.Item label="Mô tả">{data?.description}</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">{data?.note}</Descriptions.Item>
    </Descriptions>
  );
};

export default InformationQueueCard;
