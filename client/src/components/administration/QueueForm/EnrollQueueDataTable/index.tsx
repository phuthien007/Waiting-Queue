import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEnrollQueuesControllerFindAllEnrollQueue,
  useEventsControllerFindAllEvent,
} from "@api/waitingQueue";
import {
  EnrollQueueDto,
  EnrollQueuesControllerFindAllEnrollQueueStatus,
} from "@api/waitingQueue.schemas";
import {
  Button,
  Card,
  Col,
  Divider,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/lib/input/Search";
import EventForm from "components/administration/EventForm";
import TenantForm from "components/administration/TenantForm";
import _ from "lodash";
import moment from "moment";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DEFAULT_PAGE_SIZE,
  FORMAT_DATE_MINUTE,
} from "services/utils/constants";
import { StatusEnrollQueueRender } from "services/utils/format";

type Props = {
  status: string;
};

const ManagementEnrollQueues: React.FC<Props> = ({ status }) => {
  const { eventId, queueId } = useParams();

  const [page, setPage] = React.useState(1);

  const { isFetching, refetch, data } =
    useEnrollQueuesControllerFindAllEnrollQueue({
      page: 1,
      size: DEFAULT_PAGE_SIZE,
      queueId: _.parseInt(queueId) || 0,
      status: status
        ? (status as EnrollQueuesControllerFindAllEnrollQueueStatus)
        : undefined,
    });
  const columns: ColumnsType<EnrollQueueDto> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (text, record, index) => {
        return <span>{(page - 1) * DEFAULT_PAGE_SIZE + index + 1}</span>;
      },
    },
    {
      title: "Thời gian tham gia",
      dataIndex: "enrollTime",
      key: "enrollTime",
      render: (value) => moment(value).format(FORMAT_DATE_MINUTE),
    },
    {
      title: "Thời gian bắt đầu phục vụ",
      dataIndex: "enrollTime",
      key: "enrollTime",
      render: (value) => moment(value).format(FORMAT_DATE_MINUTE),
    },
    {
      title: "Thời gian kết thúc phục vụ",
      dataIndex: "enrollTime",
      key: "enrollTime",
      render: (value) => moment(value).format(FORMAT_DATE_MINUTE),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => StatusEnrollQueueRender(value),
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 100,
      key: "key",
    },
  ];

  useEffect(() => {
    refetch();
  }, [page, status]);

  return (
    <>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            loading={isFetching}
            columns={columns}
            dataSource={data?.data}
            pagination={{
              current: page,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total: data?.pagination.total || 0,
            }}
            onChange={(pagination) => {
              setPage(pagination.current);
            }}
          />
        </Card>
      </Row>
    </>
  );
};

export default ManagementEnrollQueues;
