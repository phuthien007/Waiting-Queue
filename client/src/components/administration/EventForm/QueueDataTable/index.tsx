import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useEventsControllerFindAllEvent } from "@api/waitingQueue";
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
import QueueForm from "components/administration/QueueForm";
import TenantForm from "components/administration/TenantForm";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const ManagementQueues: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const { refetch: getAllEvent, isFetching: loadingData } =
    useEventsControllerFindAllEvent({});

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Link to={`/event/${id}/queue/1`}>{text}</Link>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
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
                // reloadData={refetch}
                // saveData={updateUser}
                // loading={loadingUpdate}
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
            // saveData={createTenant}
            // loading={loadingCreate}
            type="add"
            // reloadData={refetch}
            data={{
              status: 1,
              isWorking: true,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table columns={columns} dataSource={data} />
        </Card>
      </Row>
    </>
  );
};

export default ManagementQueues;
