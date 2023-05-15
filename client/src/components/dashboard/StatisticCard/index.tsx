import React from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  UpCircleFilled,
  UserAddOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

interface IStatisticCardProps {
  totalEvent: number;
  totalQueue: number;
  role: string;
}

const StatisticCard: React.FC<IStatisticCardProps> = ({
  totalEvent,
  totalQueue,
  role,
}) => (
  <Row justify={"center"} gutter={16}>
    <Col
      style={{ width: "100%" }}
      sm={24}
      xs={24}
      xl={role === "ADMIN" ? 12 : 24}
      xxl={role === "ADMIN" ? 12 : 24}
      md={role === "ADMIN" ? 12 : 24}
      lg={role === "ADMIN" ? 12 : 24}
      className="mt-2"
    >
      <Card style={{ height: "120px", overflow: "hidden" }} className="br-8">
        <Statistic
          title="Số sự kiện"
          value={totalEvent}
          valueStyle={{ color: "var(--primary-color)" }}
          prefix={<CalendarOutlined />}
          suffix="sự kiện"
        />
      </Card>
    </Col>
    {role === "ADMIN" && (
      <Col
        style={{ width: "100%" }}
        sm={24}
        xs={24}
        xl={12}
        xxl={12}
        md={12}
        lg={12}
        className="mt-2"
      >
        <Card style={{ height: "120px", overflow: "hidden" }} className="br-8">
          <Statistic
            title="Số hàng chờ"
            value={totalQueue}
            valueStyle={{ color: "#var(--primary-color)" }}
            prefix={<UpCircleFilled />}
            suffix="hàng"
          />
        </Card>
      </Col>
    )}
  </Row>
);

export default StatisticCard;
