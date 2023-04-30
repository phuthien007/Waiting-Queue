import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import React from "react";

const StatisticData: React.FC = () => (
  <>
    <Col className="p-2" span={12}>
      <Card>
        <Statistic
          title="Thời gian đợi trung bình"
          value={11.28}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
          suffix="/lượt"
        />
      </Card>
    </Col>
    <Col span={12} className="p-2">
      <Card>
        <Statistic
          title="Thời gian phục vụ trung bình"
          value={9.3}
          precision={2}
          valueStyle={{ color: "#cf1322" }}
          prefix={<ArrowDownOutlined />}
          suffix="/lượt"
        />
      </Card>
    </Col>
  </>
);

export default StatisticData;
