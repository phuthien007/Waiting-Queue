/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import AccountForm from "components/administration/AccountForm";
import moment from "moment";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { FORMAT_DATE } from "services/utils/constants";
import { UserStatusRender } from "services/utils/format";
import { Helmet } from "react-helmet";

import AuthorityMap from "components/administration/AuthorityMap";
import FormSearchAccount from "components/form-search/FormSearchAccount";
import {
  useCreateAccount,
  useDeleteAccountById,
  useEditAccount,
  useGetAllAccounts,
  useGetListAgents,
} from "@api/manage";

const Accounts = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusAccount: undefined,
    searchAccount: undefined,
    agentAccount: undefined,
  });
  // hook get all account
  const { isFetching, refetch, data } = useGetAllAccounts(
    {
      page,
      size: 10,
      status: dataSearch.statusAccount,
      query: dataSearch.searchAccount,
      agents: dataSearch.agentAccount,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateAccount,
    isSuccess: successUpdate,
  } = useEditAccount();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createAccount,
    isSuccess: successCreate,
  } = useCreateAccount();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteAccount } =
    useDeleteAccountById();
  const [dataSearchAgent, setDataSearchAgent] = useState({
    searchAgentA1: [],
    searchAgentUser: [],
  });
  const { refetch: getAllA1 } = useGetListAgents(
    {
      type: 1,
    },
    { query: { enabled: false } }
  );
  const { refetch: getAllUser } = useGetListAgents(
    {
      type: 2,
    },
    { query: { enabled: false } }
  );

  const confirmDelete = (id) => {
    deleteAccount({ id })
      .then(() => {
        notification.success({
          message: "Xóa thành công",
        });
        setPage(1);
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      key: (record) => `serialNumber${record.id}`,
      // dataIndex: 'serialNumber',
      title: "STT",
      align: "center",
      width: "80px",
      render: (record) => (
        <span>
          {" "}
          {/* {console.log('page', page)} */}
          {/* caculate numberical order of item in page */}
          {page === 1
            ? data?.content.findIndex((item) => item.id === record.id) + 1
            : (page - 1) * 10 +
              data.content.findIndex((item) => item.id === record.id) +
              1}
        </span>
      ),
    },

    {
      key: (value, record) => `name${value}${record.id}`,
      title: "Họ tên",
      align: "center",
      dataIndex: "fullName",
    },
    {
      key: (value, record) => `username${value}${record.id}`,
      title: "Tên đăng nhập",
      align: "center",
      dataIndex: "userName",
    },
    {
      key: (value, record) => `email${value}${record.id}`,
      title: "Email",
      align: "center",
      dataIndex: "email",
    },
    {
      key: (value, record) => `email${value}${record.id}`,
      title: "Đơn vị",
      align: "center",
      render(record) {
        return <span>{record.agents.name}</span>;
      },
    },

    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return UserStatusRender(value);
        // return getAccountStatusLabel(value);
      },
    },
    {
      key: (value, record) => `createDate${value}${record.id}`,
      title: "Ngày tạo",
      dataIndex: "createDate",
      align: "center",
      render(val) {
        return moment(val).format(FORMAT_DATE);
      },
    },
    {
      key: (_, record) => `action${record.id}`,

      title: "Thao tác",
      // dataIndex: 'action',
      fixed: "right",
      align: "center",
      width: "150px",
      render: (record) => (
        <Space>
          <AccountForm
            dataAgents={dataSearchAgent}
            loadingSave={isLoadingUpdate}
            saveData={saveDataAccount}
            type="edit"
            isSuccess={successUpdate}
            data={{ ...record }}
          />
          <Tooltip title="Xóa">
            <Popconfirm
              title="XÁC NHẬN XÓA"
              onConfirm={() => confirmDelete(record.id)}
              okText="Xóa"
              okButtonProps={{
                loading: isLoadingDelete,
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
              <Button type="danger" shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const onChange = (e) => {
    setPage(e.current);
  };

  const saveDataAccount = (type, dataAccount) => {
    // transform status string to number
    dataAccount.status = Number(dataAccount.status);

    if (type === "add") {
      // call api create new doc type
      createAccount({ data: dataAccount })
        .then(() => {
          // notification success update Account
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công tài khoản : ${dataAccount.fullName}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateAccount({ id: dataAccount.id, data: dataAccount })
        .then(() => {
          // notification success update Account
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công tài khoản : ${dataAccount.fullName}`,
          });
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  useEffect(() => {
    getAllA1().then((res) => {
      // transform multiple array to single array

      getAllUser().then((res1) => {
        const tmpData = [...res1.data.flat()];
        setDataSearchAgent({
          ...dataSearchAgent,
          searchAgentUser: [...tmpData],
          searchAgentA1: [...res.data],
        });
      });
    });
  }, []);

  // reset page when having new search
  useEffect(() => {
    setPage(1);
  }, [dataSearch]);

  useEffect(() => {
    refetch();
  }, [page, dataSearch]);

  return (
    <Row>
      <Helmet title="Quản lý tài khoản" />
      <Card
        title={
          <>
            <i className="fe fe-users mr-2" />{" "}
            <strong>QUẢN LÝ TÀI KHOẢN</strong>
          </>
        }
        extra={
          <Space>
            <AuthorityMap data={data} dataSearch={dataSearchAgent} />
            <AccountForm
              type="add"
              data={{
                name: "",
                description: "",
                status: 1,
                type: "",
                manageAgents: [],
              }}
              dataAgents={dataSearchAgent}
              loadingSave={isLoadingCreate}
              saveData={saveDataAccount}
              isSuccess={successCreate}
            />
          </Space>
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchAccount
            dataSearch={dataSearchAgent}
            setDataSearch={setDataSearch}
          />
        </Row>
        <Table
          className="mt-3"
          scroll={{ x: 1000 }}
          rowKey="id"
          columns={columns}
          pagination={{
            current: page,
            pageSize: 10,
            total: data ? data.pagination.totalElements : 0,
            showSizeChanger: false,
          }}
          onChange={onChange}
          loading={isFetching}
          dataSource={data?.content || []}
        />
      </Card>
    </Row>
  );
};

export default Accounts;
