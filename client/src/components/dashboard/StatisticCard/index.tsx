import React from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  UpCircleFilled,
  UserAddOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

const StatisticCard: React.FC = () => (
  <Row justify={"center"} gutter={16}>
    <Col style={{ width: "100%" }} sm={24} md={8} lg={8} className="mt-2">
      <Card style={{ height: "120px", overflow: "hidden" }} className="br-8">
        <Statistic
          title="Số sự kiện"
          value={11}
          valueStyle={{ color: "var(--primary-color)" }}
          prefix={<CalendarOutlined />}
          suffix="sự kiện"
        />
      </Card>
    </Col>
    <Col style={{ width: "100%" }} sm={24} md={8} lg={8} className="mt-2">
      <Card style={{ height: "120px", overflow: "hidden" }} className="br-8">
        <Statistic
          title="Số hàng chờ"
          value={9}
          valueStyle={{ color: "#var(--primary-color)" }}
          prefix={<UpCircleFilled />}
          suffix="hàng"
        />
      </Card>
    </Col>
    <Col style={{ width: "100%" }} sm={24} md={8} lg={8} className="mt-2">
      <Card style={{ height: "120px", overflow: "hidden" }} className="br-8">
        <Statistic
          title="Số người trong hàng đợi"
          value={90}
          valueStyle={{ color: "#var(--primary-color)" }}
          prefix={<UserAddOutlined />}
          suffix="người"
        />
      </Card>
    </Col>
  </Row>
);

export default StatisticCard;
