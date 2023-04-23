import { Breadcrumb, Card, Descriptions, Divider, Menu } from "antd";
import InformationEventCard from "components/administration/EventForm/InformationEventCard";
import ManagementQueues from "components/administration/EventForm/QueueDataTable";
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const DetailEvent = () => {
  return (
    <>
      <Helmet title="Chi tiết sự kiện" />
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/home">Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết sự kiện</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="" className="mt-2">
        <InformationEventCard />
      </Card>

      <Divider />

      <Card title="Danh sách hàng đợi" className="mt-2">
        <ManagementQueues />
      </Card>
    </>
  );
};

export default DetailEvent;
