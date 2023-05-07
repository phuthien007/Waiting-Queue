import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEventsControllerFindAllEvent,
  useQueuesControllerCreateQueue,
  useQueuesControllerFindAllQueue,
  useQueuesControllerFindAllQueueUserCanSee,
  useQueuesControllerRemoveQueue,
  useQueuesControllerUpdateQueue,
} from "@api/waitingQueue";
import { QueueDto } from "@api/waitingQueue.schemas";
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
  notification,
} from "antd";
import UserOperateQueue from "components/administration/QueueForm/UserOperateQueue";
import type { ColumnsType } from "antd/es/table";
import Search from "antd/lib/input/Search";
import QueueForm from "components/administration/QueueForm";
import TenantForm from "components/administration/TenantForm";
import _ from "lodash";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DEFAULT_PAGE_SIZE, STATUS_QUEUE_ENUM } from "services/utils/constants";
import { StatusQueueRender } from "services/utils/format";
import { selectUser } from "store/userSlice";
import { useSelector } from "react-redux";

const ManagementQueues: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const [searchText, setSearchText] = React.useState("");
  const onSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };
  const [page, setPage] = React.useState<number>(1);
  const { role } = useSelector(selectUser);
  const {
    refetch: getAllQueueByEventId,
    isFetching: loadingQueue,
    data: queueData,
  } = useQueuesControllerFindAllQueue({
    eq: [`event.id:${id}`],
    like: [`name:${searchText}`],
  });

  const {
    refetch: getAllMyQueueByEventId,
    isFetching: loadingMyQueue,
    data: queueMyData,
  } = useQueuesControllerFindAllQueueUserCanSee({
    eventId: _.toSafeInteger(id),
    search: `${searchText}`,
    page: page,
    size: DEFAULT_PAGE_SIZE,
  });

  const { isLoading: loadingCreate, mutateAsync: createQueue } =
    useQueuesControllerCreateQueue();

  const { isLoading: loadingUpdate, mutateAsync: updateQueue } =
    useQueuesControllerUpdateQueue();

  const { isLoading: loadingDelete, mutateAsync: deleteQueue } =
    useQueuesControllerRemoveQueue();

  const columns: ColumnsType<QueueDto> = [
    {
      title: "Tên hàng đợi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/event/${id}/queue/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Vị trí hàng đợi",
      dataIndex: "coord",
      key: "coord",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => StatusQueueRender(status),
    },
    {
      title: "Người điều hành",
      key: "operateUser",
      render: (record: QueueDto) => <UserOperateQueue id={record.id} />,
    },

    {
      title: "Hành động",
      fixed: "right",
      width: 100,
      key: "key",
      render: (record) => {
        return (
          <>
            {role === "ADMIN" && (
              <Space>
                <QueueForm
                  reloadData={handleReloadData}
                  saveData={updateQueue}
                  loading={loadingUpdate}
                  type="edit"
                  data={record}
                />

                <Tooltip title="Xóa">
                  <Popconfirm
                    title="XÁC NHẬN XÓA"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa"
                    okButtonProps={{
                      loading: loadingDelete,
                    }}
                    cancelText="Hủy"
                    icon={
                      <QuestionCircleOutlined
                        style={{
                          color: "red",
                        }}
                      />
                    }
                  >
                    <Button
                      className="ant-btn-danger"
                      shape="circle"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            )}
            {role === "OPERATOR" && (
              <QueueForm
                reloadData={handleReloadData}
                saveData={updateQueue}
                loading={loadingUpdate}
                type="view"
                data={record}
              />
            )}
          </>
        );
      },
    },
  ];
  const handleReloadData = () => {
    setPage(1);
    setSearchText("");
    if (role === "ADMIN") {
      getAllQueueByEventId();
    } else if (role === "OPERATOR") {
      getAllMyQueueByEventId();
    }
  };
  const handleDelete = async (id: string) => {
    await deleteQueue({
      id: _.parseInt(id),
    }).then(() => {
      if (!loadingDelete) {
        notification.success({
          message: "Thành công",
          description: "Xóa hàng đợi thành công",
        });
        handleReloadData();
      }
    });
  };

  useEffect(() => {
    if (role === "ADMIN") {
      getAllQueueByEventId();
    } else if (role === "OPERATOR") {
      getAllMyQueueByEventId();
    }
  }, [searchText, page]);

  return (
    <>
      {/* <Row>
        <Col span={24}>
          <h2>Danh sách sự kiện</h2>
          <Divider />
        </Col>
      </Row> */}
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Search
            allowClear
            placeholder="Tìm kiếm theo tên"
            onSearch={onSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          {role === "ADMIN" && (
            <QueueForm
              saveData={createQueue}
              loading={loadingCreate}
              type="add"
              reloadData={handleReloadData}
              data={{
                status: STATUS_QUEUE_ENUM.PENDING,
              }}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            scroll={{ x: 1000 }}
            loading={loadingQueue || loadingMyQueue}
            columns={columns}
            dataSource={role === "ADMIN" ? queueData?.data : queueMyData?.data}
            pagination={{
              current: page,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total:
                (role === "ADMIN"
                  ? queueData?.pagination?.total
                  : queueMyData?.pagination?.total) || 0,
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

export default ManagementQueues;
