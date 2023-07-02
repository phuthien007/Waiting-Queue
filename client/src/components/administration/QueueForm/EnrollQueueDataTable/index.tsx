import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEnrollQueuesControllerFindAllEnrollQueue,
  useEnrollQueuesControllerRemoveEnrollQueue,
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
  List,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
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
  const { eventId, queueCode } = useParams();
  const [dataSource, setDataSource] = React.useState<{
    data: EnrollQueueDto[];
    pagination: {
      current: number;
      pageSize: number;
      total: number;
    };
  }>({
    data: [],
    pagination: {
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
    },
  });
  const [page, setPage] = React.useState(1);

  const { isFetching, refetch, data } =
    useEnrollQueuesControllerFindAllEnrollQueue({
      page: page,
      size: DEFAULT_PAGE_SIZE,
      queueCode: queueCode,
      status: status
        ? (status as EnrollQueuesControllerFindAllEnrollQueueStatus)
        : undefined,
    });

  const { isLoading: loadingRemove, mutateAsync: deleteEnrollQueue } =
    useEnrollQueuesControllerRemoveEnrollQueue();

  const columns: ColumnsType<EnrollQueueDto> = [
    {
      title: "STT",
      dataIndex: "sequenceNumber",
      key: "id",
      width: 50,
    },
    {
      title: "Thời gian tham gia",
      dataIndex: "enrollTime",
      key: "enrollTime",
      render: (value) => moment(value).format(FORMAT_DATE_MINUTE),
    },
    {
      title: "Thời gian bắt đầu phục vụ",
      dataIndex: "startServe",
      key: "enrollTime",
      render: (value) =>
        value ? moment(value).format(FORMAT_DATE_MINUTE) : null,
    },
    {
      title: "Thời gian kết thúc phục vụ",
      dataIndex: "endServe",
      key: "enrollTime",
      render: (value) =>
        value ? moment(value).format(FORMAT_DATE_MINUTE) : null,
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
      render: (record) => {
        return (
          <>
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => {
                deleteEnrollQueue({
                  id: record.id,
                });
              }}
              onCancel={() => {}}
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    refetch().then((res) => {
      setDataSource(res?.data);
    });
  }, [page, status]);

  useEffect(() => {
    const enrollQueueInterval = setInterval(() => {
      refetch().then((res) => {
        setDataSource(res?.data);
        setPage(1);
      });
    }, 15000);
    return () => {
      clearInterval(enrollQueueInterval);
    };
  }, []);

  return (
    <>
      <Row>
        <Col xs={0} sm={0} md={24} xl={24} xxl={24} lg={24}>
          <Card style={{ width: "100%" }} className="br-8">
            <Table
              scroll={{ x: 800 }}
              // loading={isFetching}
              columns={columns}
              dataSource={dataSource?.data}
              pagination={{
                current: page,
                pageSize: DEFAULT_PAGE_SIZE,
                showSizeChanger: false,
                total: dataSource?.pagination.total || 0,
              }}
              onChange={(pagination) => {
                setPage(pagination.current);
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={0} xl={0} xxl={0} lg={0}>
          <List
            itemLayout="horizontal"
            dataSource={dataSource?.data}
            renderItem={(item: EnrollQueueDto) => (
              <List.Item>
                <List.Item.Meta
                  title={`Số: ${item.sequenceNumber}`}
                  description={
                    <>
                      <p>
                        {item?.enrollTime
                          ? moment(item?.enrollTime).format(FORMAT_DATE_MINUTE)
                          : null}
                      </p>

                      <p>
                        {item?.startServe
                          ? moment(item?.startServe).format(FORMAT_DATE_MINUTE)
                          : null}
                      </p>
                      <p>
                        {item?.endServe
                          ? moment(item?.endServe).format(FORMAT_DATE_MINUTE)
                          : null}
                      </p>
                    </>
                  }
                />
              </List.Item>
            )}
            pagination={{
              responsive: true,
              current: page,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total: dataSource?.pagination.total || 0,

              onChange: (page) => {
                setPage(page);
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default ManagementEnrollQueues;
