import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEventsControllerCreateEvent,
  useEventsControllerFindAllEventUseCanSee,
  useEventsControllerUpdateEvent,
} from "@api/waitingQueue";
import { EventDto } from "@api/waitingQueue.schemas";
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
import moment from "moment";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FORMAT_DATE_MINUTE } from "services/utils/constants";

const ManagementEvents: React.FC = () => {
  const [searchText, setSearchText] = React.useState("");

  const {
    refetch: getAllEvent,
    isFetching: loadingData,
    data,
  } = useEventsControllerFindAllEventUseCanSee({
    like: [`name:${searchText}`],
  });

  const { isLoading: loadingUpdate, mutateAsync: updateEvent } =
    useEventsControllerUpdateEvent();
  const { isLoading: loadingCreate, mutateAsync: createEvent } =
    useEventsControllerCreateEvent();

  const columns: ColumnsType<EventDto> = [
    {
      title: "Tên sự kiện",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Link to={`/event/${record.id}`}>{text}</Link>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text === 1 ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Đã đóng</Tag>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thời gian",
      key: "time",
      render: (record) => {
        if (record.daily) return <Tag color="blue">Hàng ngày</Tag>;

        return (
          <>
            Từ {moment(record.from).format(FORMAT_DATE_MINUTE)} đến{" "}
            {moment(record.to).format(FORMAT_DATE_MINUTE)}
          </>
        );
      },
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
              <EventForm
                reloadData={getAllEvent}
                saveData={updateEvent}
                loading={loadingUpdate}
                type="edit"
                data={record}
              />

              <Tooltip title="Xóa">
                <Popconfirm
                  title="XÁC NHẬN XÓA"
                  // onConfirm={() => handleDelete(record.id)}
                  okText="Xóa"
                  okButtonProps={
                    {
                      // loading: loadingDelete,
                    }
                  }
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

  useEffect(() => {
    getAllEvent();
  }, [searchText]);

  return (
    <>
      <Row>
        <Col span={24}>
          <h2>Danh sách sự kiện</h2>
          <Divider />
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Search
            allowClear
            placeholder="Tìm kiếm theo tên"
            onSearch={(e) => setSearchText(e)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          <EventForm
            saveData={createEvent}
            loading={loadingCreate}
            type="add"
            reloadData={getAllEvent}
            data={{
              status: true,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table columns={columns} dataSource={data} scroll={{ x: 1000 }} />
        </Card>
      </Row>
    </>
  );
};

export default ManagementEvents;
