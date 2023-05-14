import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { StatisticQueueDto } from "@api/waitingQueue.schemas";
import { Card, Col, Row, Statistic } from "antd";
import React from "react";

interface IStatisticData {
  dataStatistic: StatisticQueueDto;
}

const StatisticData: React.FC<IStatisticData> = ({ dataStatistic }) => (
  <>
    <Col className="p-2" md={12} lg={12} xl={12} xxl={12} xs={24} sm={12}>
      <Card className="br-8">
        <Statistic
          title="Thời gian đợi trung bình"
          value={dataStatistic?.timeWaitAvg || 0}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
          suffix="s/lượt"
        />
      </Card>
    </Col>
    <Col md={12} lg={12} xl={12} xxl={12} xs={24} sm={12} className="p-2">
      <Card className="br-8">
        <Statistic
          title="Thời gian phục vụ trung bình"
          value={dataStatistic?.timeServeAvg || 0}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
          suffix="s/lượt"
        />
      </Card>
    </Col>
  </>
);

export default StatisticData;
