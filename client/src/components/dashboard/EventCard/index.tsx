import {
  DeleteColumnOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { EventDto } from "@api/waitingQueue.schemas";
import { Button, Card, Descriptions, Divider, Image, Row, Tag } from "antd";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { serveImage } from "services/utils";
import { FORMAT_DATE_MINUTE } from "services/utils/constants";

export type Props = {
  data: EventDto;
};

const EventCard: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Card
        title={<Link to={`/event/${data?.id}`}>{data?.name}</Link>}
        extra={
          <Button type="link" href={`/event/${data?.id}`}>
            Xem chi tiết
          </Button>
        }
      >
        <Row justify="center">
          <Image
            // width={200}
            height={180}
            src={serveImage(data?.drawImagePath)}
          />
        </Row>

        <hr />
        <Descriptions column={1}>
          <Descriptions.Item label="Thời gian">
            {data?.daily
              ? "Hàng ngày"
              : `Từ ${moment(data?.from).format(
                  FORMAT_DATE_MINUTE
                )} đến ${moment(data?.to).format(FORMAT_DATE_MINUTE)}`}
          </Descriptions.Item>
          <Descriptions.Item label="Địa điểm">{data?.place}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {data?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {data?.status ? (
              <Tag color="green">Hoạt động</Tag>
            ) : (
              <Tag color="red">Đã đóng</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
        {/* <Divider />
        <Row justify="space-between">
          <Button
            style={{ color: "red !important" }}
            color="red"
            className="mt-1 ant-btn-danger"
            shape="round"
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
          <Button
            type="primary"
            className="mt-1"
            shape="round"
            icon={<EditOutlined />}
          >
            Sửa
          </Button>
        </Row> */}
      </Card>
    </>
  );
};

export default EventCard;
