import { Descriptions } from "antd";
import React from "react";

const InformationEventCard = () => {
  return (
    <Descriptions
      title="Chi tiết sự kiện"
      column={{
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 3,
        sm: 2,
        xs: 1,
      }}
    >
      <Descriptions.Item label="Tên sự kiện">Sự kiện A</Descriptions.Item>
      <Descriptions.Item label="Địa điểm">1810000000</Descriptions.Item>
      <Descriptions.Item label="Thời gian">
        Hangzhou, Zhejiang
      </Descriptions.Item>
      <Descriptions.Item label="Mô tả">empty</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">
        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
      </Descriptions.Item>
    </Descriptions>
  );
};

export default InformationEventCard;
