import { useEventsControllerFindOneEvent } from "@api/waitingQueue";
import { Breadcrumb, Card, Descriptions, Divider, Menu } from "antd";
import InformationEventCard from "components/administration/EventForm/InformationEventCard";
import ManagementQueues from "components/administration/EventForm/QueueDataTable";
import React from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";

const DetailEvent = () => {
  const params = useParams();
  const { id } = params;

  const {
    refetch: getDataEvent,
    isFetching,
    data,
  } = useEventsControllerFindOneEvent(_.parseInt(id) || 0, {
    query: {
      enabled: false,
    },
  });

  React.useEffect(() => {
    getDataEvent();
  }, [id]);

  return (
    <>
      <Helmet title="Chi tiết sự kiện" />
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/home">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/manage/event">Sự kiện</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết sự kiện</Breadcrumb.Item>
      </Breadcrumb>

      <Card loading={isFetching} title="" className="mt-2">
        <InformationEventCard data={data} />
      </Card>

      <Divider />

      <Card title="Danh sách hàng đợi" className="mt-2">
        <ManagementQueues />
      </Card>
    </>
  );
};

export default DetailEvent;
