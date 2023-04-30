import {
  useEventsControllerFindOneEvent,
  useQueuesControllerFindOneQueue,
} from "@api/waitingQueue";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Menu,
  Row,
  Tabs,
} from "antd";
import InformationEventCard from "components/administration/EventForm/InformationEventCard";
import ManagementQueues from "components/administration/EventForm/QueueDataTable";
import ManagementEnrollQueues from "components/administration/QueueForm/EnrollQueueDataTable";
import InformationQueueCard from "components/administration/QueueForm/InformationQueueCard";
import StatisticData from "components/administration/QueueForm/StatisticData";
import _ from "lodash";
import React from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";

const DetailEvent = () => {
  const params = useParams();
  const { eventId, queueId } = params;

  const {
    refetch: getDataEvent,
    isFetching: loadingDataEvent,
    data: dataEvent,
  } = useEventsControllerFindOneEvent(_.parseInt(eventId) || 0, {
    query: {
      enabled: false,
    },
  });
  const {
    refetch: getDataQueue,
    isFetching: loadingDataQueue,
    data: dataQueue,
  } = useQueuesControllerFindOneQueue(_.parseInt(queueId) || 0, {
    query: {
      enabled: false,
    },
  });

  React.useEffect(() => {
    getDataEvent();
    getDataQueue();
  }, [eventId, queueId]);
  return (
    <>
      <Helmet title="Chi tiết sự kiện" />
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/home">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/event/${eventId}`}>Chi tiết sự kiện</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết hàng đợi</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col className="p-2" sm={24} md={12} xl={12}>
          <Card loading={loadingDataEvent} title="" className="mt-2">
            <InformationEventCard data={dataEvent} />
          </Card>
        </Col>
        <Col className="p-2" sm={24} md={12} xl={12}>
          <Card loading={loadingDataQueue} title="" className="mt-2">
            <InformationQueueCard data={dataQueue} />
          </Card>
        </Col>
      </Row>

      <Divider />
      <Row>
        {/* <Col span={24}> */}
        <StatisticData />
        {/* </Col> */}
      </Row>
      <Row justify="center">
        {/* // render card to display a number current serving */}
        <Card>
          <h1>3</h1>
        </Card>
      </Row>
      <Divider />

      <Card title="Danh sách người đợi" className="mt-2">
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab="Tất cả" key="1">
            <ManagementEnrollQueues />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đang chờ" key="2">
            <ManagementEnrollQueues />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đã xong" key="3">
            <ManagementEnrollQueues />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đã hủy" key="4">
            <ManagementEnrollQueues />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default DetailEvent;
