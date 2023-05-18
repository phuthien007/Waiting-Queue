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
  } = useEventsControllerFindOneEvent(id, {
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

      <Card className="br-8 mt-2" loading={isFetching} title="">
        <InformationEventCard data={data} />
      </Card>

      <Divider />

      <Card className="br-8 mt-2" title="Danh sách hàng đợi">
        <ManagementQueues />
      </Card>
    </>
  );
};

export default DetailEvent;
