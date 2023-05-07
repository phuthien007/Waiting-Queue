import { EventDto } from "@api/waitingQueue.schemas";
import { Descriptions } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_DATE_MINUTE } from "services/utils/constants";

type Props = {
  data?: EventDto;
};

const InformationEventCard: React.FC<Props> = ({ data }) => {
  return (
    <Descriptions
      title="Chi tiết sự kiện"
      column={{
        xxl: 3,
        xl: 3,
        lg: 3,
        md: 2,
        sm: 2,
        xs: 1,
      }}
    >
      <Descriptions.Item label="Tên sự kiện">{data?.name}</Descriptions.Item>
      <Descriptions.Item label="Địa điểm">{data?.place}</Descriptions.Item>
      <Descriptions.Item label="Thời gian">
        {data?.daily
          ? "Hàng ngày"
          : `Từ ${moment(data?.from).format(FORMAT_DATE_MINUTE)} đến ${moment(
              data?.to
            ).format(FORMAT_DATE_MINUTE)}`}
      </Descriptions.Item>
      <Descriptions.Item label="Mô tả">{data?.description}</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">{data?.note}</Descriptions.Item>
    </Descriptions>
  );
};

export default InformationEventCard;
