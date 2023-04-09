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
import {
  useCreateTicketSubSystems,
  useDeleteTicketSubSystems,
  useGetAllTicketSubSystems,
  useUpdateTicketSubSystems,
} from "@api/manage";
import { Helmet } from "react-helmet";
import { SubSystemsStatusRender } from "services/utils/format";
import SubSystemForm from "components/administration/SubSystemForm";
import FormSearchSubSystem from "components/form-search/FormSearchSubSystem";

const SubSystems = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusSubSystem: undefined,
    searchSubSystem: undefined,
    systems: undefined,
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllTicketSubSystems(
    {
      page: page - 1,
      size: 10,
      "status.equals": dataSearch.statusSubSystem,
      "name.contains": dataSearch.searchSubSystem,
      "systemsId.in": dataSearch.systems,

      sort: "name,asc",
    },
    { query: { enabled: false } }
  );
  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateSubSystem,
    isSuccess: successUpdate,
  } = useUpdateTicketSubSystems();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createSubSystem,
    isSuccess: successCreate,
  } = useCreateTicketSubSystems();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteSubSystem } =
    useDeleteTicketSubSystems();

  const confirmDelete = (id) => {
    deleteSubSystem({ id })
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
      title: "Tên phân hệ ",
      align: "center",
      dataIndex: "name",
    },
    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return SubSystemsStatusRender(value);
        // return getDocTypeStatusLabel(value);
      },
    },
    {
      key: (value, record) => `SubsystemName${value}${record.id}`,
      title: "Hệ thống",
      align: "center",
      render(value) {
        console.log("value", value);
        return <span>{value?.systems?.name || ""}</span>;
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
      width: "150px",
      fixed: "right",
      render: (record) => (
        <Space>
          <SubSystemForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataSubSystem}
            type="edit"
            isSuccess={successUpdate}
            data={{ ...record }}
          />
          <Tooltip title="Xóa">
            <Popconfirm
              title="XÁC NHẬN XÓA"
              okButtonProps={{
                loading: isLoadingDelete,
              }}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => confirmDelete(record.id)}
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

  const saveDataSubSystem = (type, dataSubSystem) => {
    // transform status string to number
    dataSubSystem.status = dataSubSystem.status === "true";
    dataSubSystem.systems = { id: dataSubSystem.systems };
    if (type === "add") {
      // call api create new doc type
      createSubSystem({ data: dataSubSystem })
        .then(() => {
          // notification success update SubSystem
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công hệ thống : ${dataSubSystem.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateSubSystem({ id: dataSubSystem.id, data: dataSubSystem })
        .then(() => {
          // notification success update SubSystem
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công hệ thống : ${dataSubSystem.name}`,
          });
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  // reset page when having new search
  useEffect(() => {
    setPage(1);
  }, [dataSearch]);
  useEffect(() => {
    refetch();
  }, [page, dataSearch]);

  return (
    <Row>
      <Helmet title="Quản lý phân hệ con" />
      <Card
        title={
          <>
            <i className="fe fe-layers mr-2" />{" "}
            <strong>QUẢN LÝ PHÂN HỆ CON</strong>
          </>
        }
        extra={
          <SubSystemForm
            type="add"
            data={{
              name: "",
              description: "",
              status: true,
            }}
            isSuccess={successCreate}
            loadingSave={isLoadingCreate}
            saveData={saveDataSubSystem}
          />
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchSubSystem setDataSearch={setDataSearch} />
        </Row>

        <Table
          className="mt-3"
          scroll={{ x: 1000 }}
          rowKey="id"
          columns={columns}
          pagination={{
            current: page,
            pageSize: 10,
            total: data ? data.totalElements : 0,
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

export default SubSystems;
