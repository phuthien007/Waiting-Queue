import {
  DeleteColumnOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export type Props = {
  title: string;
};

const EventCard: React.FC<Props> = ({ title }) => {
  return (
    <>
      <Card
        title={<Link to={"/event/detail"}>title</Link>}
        extra={<Button type="link">Xem chi tiết</Button>}
      >
        <p>Ngày 1/1/2021</p>
        <p>Địa điểm: 123 đường 1</p>
        <p>Thời gian: 12:00</p>
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
