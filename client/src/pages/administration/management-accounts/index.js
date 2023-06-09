import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  useUsersControllerCreateUser,
  useUsersControllerFindAllUser,
  useUsersControllerRemoveUser,
  useUsersControllerUpdateUser,
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
import { DEFAULT_PAGE_SIZE } from "services/utils/constants";
import { RoleRender, StatusRender } from "services/utils/format";

function ManagementAccounts() {
  const [keyword, setKeyword] = useState();
  const [page, setPage] = useState(1);
  const { isLoading: loadingDelete, mutateAsync: deleteAccount } =
    useUsersControllerRemoveUser();
  const {
    refetch,
    isFetching,
    data: dataAccount,
  } = useUsersControllerFindAllUser({
    like: keyword ? [`email:${keyword}`] : [],
    page: page,
    size: DEFAULT_PAGE_SIZE,
    sort: ["createdAt,desc"],
  });

  const { isLoading: loadingCreate, mutateAsync: createUser } =
    useUsersControllerCreateUser();
  const { isLoading: loadingUpdate, mutateAsync: updateUser } =
    useUsersControllerUpdateUser();

  const handleDelete = (id) => {
    deleteAccount({
      id: id,
    }).then((res) => {
      if (res) {
        notification.success({
          message: "Xóa thành công",
        });
        handleReloadData();
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
              <AccountForm
                reloadData={handleReloadData}
                saveData={updateUser}
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
    setPage(1);
  };

  const handleReloadData = () => {
    setPage(1);
    setKeyword("");
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [keyword, page]);

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
            reloadData={handleReloadData}
            saveData={createUser}
            loading={loadingCreate}
            type="add"
            data={{
              role: "operator",

              status: 1,
              isWorking: false,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card className="br-8" style={{ width: "100%" }}>
          <Table
            scroll={{ x: 1200 }}
            rowKey="id"
            loading={isFetching}
            style={{ width: "100%" }}
            dataSource={dataAccount?.data || []}
            columns={columns}
            pagination={{
              current: page,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total: dataAccount?.pagination.total || 0,
            }}
            onChange={(pagination) => {
              setPage(pagination.current);
            }}
          />
        </Card>
      </Row>
    </>
  );
}

export default ManagementAccounts;
