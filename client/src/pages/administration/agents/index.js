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
import moment from "moment";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { FORMAT_DATE } from "services/utils/constants";
import AgentForm from "components/administration/AgentForm";
import SiteMap from "components/administration/SiteMap";
import { AgentStatusRender, AgentTypeRender } from "services/utils/format";
import FormSearchAgent from "components/form-search/FormSearchAgent";
import {
  useCreateAgent,
  useDeleteAgentById,
  useEditAgent,
  useGetAllAgents,
  useGetListAgents,
} from "@api/manage";
import { Helmet } from "react-helmet";

const Agents = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusAgent: undefined,
    searchAgent: undefined,
    typeAgent: undefined,
  });

  const { refetch: refetchListAgent, data: dataListAgent } = useGetListAgents(
    {
      type: 1,
    },
    { query: { enabled: false } }
  );
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllAgents(
    {
      page,
      size: 10,
      status: dataSearch.statusAgent,
      query: dataSearch.searchAgent,
      type: dataSearch.typeAgent,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateAgent,
    isSuccess: successUpdate,
  } = useEditAgent();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createAgent,
    isSuccess: successCreate,
  } = useCreateAgent();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteAgent } =
    useDeleteAgentById();

  const confirmDelete = (id) => {
    deleteAgent({ id })
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
      title: "Tên đơn vị",
      align: "center",
      dataIndex: "name",
    },

    {
      key: (value, record) => `description${value}${record.id}`,
      title: "Mô tả",
      align: "center",
      dataIndex: "description",
    },

    {
      key: (value, record) => `agentType${value}${record.id}`,
      title: "Loại đơn vị",
      align: "center",
      dataIndex: "type",
      render(value) {
        return AgentTypeRender(value);
      },
    },

    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return AgentStatusRender(value);
        // return getAgentStatusLabel(value);
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
      align: "center",
      fixed: "right",
      width: "150px",
      render: (record) => (
        <Space>
          <AgentForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataAgent}
            type="edit"
            isSuccess={successUpdate}
            data={{ ...record, listAgent: dataListAgent || [] }}
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

  const saveDataAgent = (type, dataAgent) => {
    // transform status string to number
    dataAgent.status = Number(dataAgent.status);
    dataAgent.type = Number(dataAgent.type);
    console.log("add", dataAgent);
    if (type === "add") {
      // call api create new doc type
      createAgent({ data: dataAgent })
        .then(() => {
          // notification success update Agent
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công đơn vị : ${dataAgent.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateAgent({ id: dataAgent.id, data: dataAgent })
        .then(() => {
          // notification success update Agent
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công đơn vị : ${dataAgent.name}`,
          });
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  useEffect(() => {
    refetchListAgent();
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
      <Helmet title="Quản lý đơn vị" />
      <Card
        title={
          <>
            <i className="fa fa-building-o mr-2" />{" "}
            <strong>QUẢN LÝ ĐƠN VỊ</strong>
          </>
        }
        extra={
          <Space>
            <SiteMap />
            <AgentForm
              type="add"
              data={{
                name: "",
                description: "",
                status: 1,
                type: "",
                manageAgents: [],
                listAgent: dataListAgent || [],
              }}
              loadingSave={isLoadingCreate}
              saveData={saveDataAgent}
              isSuccess={successCreate}
            />
          </Space>
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchAgent setDataSearch={setDataSearch} />
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

export default Agents;
