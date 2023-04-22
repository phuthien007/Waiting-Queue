import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useUsersControllerFindAllUser,
  useUsersControllerRemoveUser,
} from "@api/waitingQueue";
import {
  Button,
  Card,
  Col,
  Divider,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import Search from "antd/lib/input/Search";
import AccountForm from "components/administration/AccountForm";
// import FormAccount from 'components/admin/managements/FormAccount'
import { toInteger } from "lodash";
import React, { useEffect, useState } from "react";
// import { CSVLink } from 'react-csv'
import { Helmet } from "react-helmet";
import { RoleRender, StatusRender } from "services/utils/format";

const dataSource = [];

function ManagementAccounts() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(dataSource);

  const { isLoading: loadingDelete, mutateAsync: deleteAccount } =
    useUsersControllerRemoveUser();
  const {
    refetch,
    isFetching,
    data: dataAccount,
  } = useUsersControllerFindAllUser({});

  const [keyword, setKeyword] = useState("");

  const handleDelete = (id) => {
    deleteAccount({
      id: id,
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Xóa thành công",
        });
        refetch();
      }
    });
  };

  const columns = [
    {
      title: "Họ và tên",
      key: (record) => `name_${record.id}`,
      render: (record) => <span>{`${record.fullName || ""}`}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: (text, record) => `email_${text}_${record.id}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: (text, record) => `phone_${text}_${record.id}`,
    },
    {
      title: "Trạng thái tài khoản",
      dataIndex: "status",
      key: (text, record) => `activated_${text}_${record.id}`,
      render: (value) => StatusRender(value),
    },
    {
      title: "Công ty",
      dataIndex: "tenant",
      key: (text, record) => `partnerName_${text}_${record.id}`,
      render: (value) => <span>{value?.name || ""}</span>,
    },
    {
      title: "Vai trò",
      width: 200,
      key: (record) => `role__${record.id}`,
      render: (record) => RoleRender(record.role),
    },
    // {
    //   title: "Ghi chú",
    //   dataIndex: "note",
    //   key: (text, record) => `note_${text}_${record.id}`,
    // },
    {
      title: "Hành động",
      fixed: "right",
      width: 120,
      key: (record) => `eactions_${record.id}`,
      render: (record) => {
        return (
          <>
            <Space>
              <AccountForm type="edit" data={record} />

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
                    type="danger"
                    shape="circle"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
            {/* <Popconfirm title="Bạn có chắc muốn xóa tài khoản này không?">
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={(record) => deleteAccount(record.id)}
                loading={loadingDelete}
                className="ml-2"
              />
            </Popconfirm> */}
          </>
        );
      },
    },
  ];

  const onSearch = (value) => {
    setKeyword(value);
    getData(0, pagination.pageSize, value);
  };

  const handleChangeTable = (e) => {
    setPagination({
      ...pagination,
      ...e,
    });

    getData(e.current - 1, pagination.pageSize, keyword);
  };

  const saveData = (newData) => {};

  const getData = async (page, size, key = keyword) => {};

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Helmet title="Management Account" />{" "}
      <Row>
        <Col span={24}>
          <h2>Danh sách tài khoản</h2>
          <Divider />
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Search
            allowClear
            placeholder="Tìm kiếm theo email"
            onSearch={onSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          <AccountForm
            saveData={saveData}
            type="add"
            data={{
              email: "",
              role: "operator",
              fullName: "",
              note: "",
              status: 1,
              isWorking: true,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            scroll={{ x: 1200 }}
            rowKey="id"
            onChange={handleChangeTable}
            loading={loading}
            style={{ width: "100%" }}
            dataSource={dataAccount}
            // pagination={pagination}
            columns={columns}
          />
        </Card>
      </Row>
    </>
  );
}

export default ManagementAccounts;
