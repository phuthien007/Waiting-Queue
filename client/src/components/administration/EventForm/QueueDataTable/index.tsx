import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEventsControllerFindAllEvent,
  useQueuesControllerCreateQueue,
  useQueuesControllerFindAllQueue,
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
import type { ColumnsType } from "antd/es/table";
import Search from "antd/lib/input/Search";
import QueueForm from "components/administration/QueueForm";
import TenantForm from "components/administration/TenantForm";
import _ from "lodash";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { STATUS_QUEUE_ENUM } from "services/utils/constants";
import { StatusQueueRender } from "services/utils/format";

const ManagementQueues: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const {
    refetch: getAllQueueByEventId,
    isFetching: loadingQueue,
    data: queueData,
  } = useQueuesControllerFindAllQueue({
    eq: [`event.id:${id}`],
  });

  const { isLoading: loadingCreate, mutateAsync: createQueue } =
    useQueuesControllerCreateQueue();

  const { isLoading: loadingUpdate, mutateAsync: updateQueue } =
    useQueuesControllerUpdateQueue();

  const { isLoading: loadingDelete, mutateAsync: deleteQueue } =
    useQueuesControllerRemoveQueue();

  const columns: ColumnsType<QueueDto> = [
    {
      title: "Name",
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
      title: "Hành động",
      fixed: "right",
      width: 100,
      key: "key",
      render: (record) => {
        return (
          <>
            <Space>
              <QueueForm
                reloadData={getAllQueueByEventId}
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
          </>
        );
      },
    },
  ];

  const handleDelete = async (id: string) => {
    await deleteQueue({
      id: _.parseInt(id),
    }).then(() => {
      getAllQueueByEventId();
      if (!loadingDelete) {
        notification.success({
          message: "Thành công",
          description: "Xóa hàng đợi thành công",
        });
      }
    });
  };

  useEffect(() => {
    getAllQueueByEventId();
  }, []);

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
            // onSearch={onSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          <QueueForm
            saveData={createQueue}
            loading={loadingCreate}
            type="add"
            reloadData={getAllQueueByEventId}
            data={{
              status: STATUS_QUEUE_ENUM.PENDING,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            loading={loadingQueue}
            columns={columns}
            dataSource={queueData}
          />
        </Card>
      </Row>
    </>
  );
};

export default ManagementQueues;
