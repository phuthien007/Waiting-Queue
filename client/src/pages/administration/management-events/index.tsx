import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useEventsControllerCreateEvent,
  useEventsControllerFindAllEventUserCanSee,
  useEventsControllerUpdateEvent,
  useEventsControllerFindAllEvent,
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
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  DEFAULT_PAGE_SIZE,
  FORMAT_DATE_MINUTE,
} from "services/utils/constants";
import { selectUser } from "store/userSlice";

const ManagementEvents: React.FC = () => {
  const [searchText, setSearchText] = React.useState<string>("");
  const { role } = useSelector(selectUser);
  const [page, setPage] = useState<number>(1);

  const {
    refetch: getAllMyEvent,
    isFetching: loadingMyData,
    data: myEvent,
  } = useEventsControllerFindAllEventUserCanSee({
    search: `${searchText}`,
    page: page,
    size: DEFAULT_PAGE_SIZE,
  });
  const {
    refetch: getAllEvent,
    isFetching: loadingData,
    data: dataEvent,
  } = useEventsControllerFindAllEvent({
    like: [`name:${searchText}`],
    page: page,
    size: DEFAULT_PAGE_SIZE,
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
        return _.toString(text) === "1" ? (
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
            {role === "ADMIN" && (
              <Space>
                <EventForm
                  reloadData={handleReloadData}
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
            )}
            {role === "OPERATOR" && (
              <EventForm
                // reloadData={handleReloadData}
                // saveData={updateEvent}
                // loading={loadingUpdate}
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
    if (role === "ADMIN") getAllEvent();
    else if (role === "OPERATOR") getAllMyEvent();
  };

  useEffect(() => {
    if (role === "ADMIN") getAllEvent();
    else if (role === "OPERATOR") getAllMyEvent();
  }, [searchText, page]);

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
            onSearch={(e) => {
              setSearchText(e);
              setPage(1);
            }}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          {role === "ADMIN" && (
            <EventForm
              saveData={createEvent}
              loading={loadingCreate}
              type="add"
              reloadData={handleReloadData}
              data={{
                status: true,
              }}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            loading={loadingData || loadingMyData}
            columns={columns}
            dataSource={role === "ADMIN" ? dataEvent?.data : myEvent?.data}
            scroll={{ x: 1000 }}
            pagination={{
              current: page,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total:
                (role === "ADMIN"
                  ? dataEvent?.pagination?.total
                  : myEvent?.pagination?.total) || 0,
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

export default ManagementEvents;
