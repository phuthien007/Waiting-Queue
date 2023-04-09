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
import SystemForm from "components/administration/SystemForm";
import { SystemStatusRender } from "services/utils/format";
import {
  useCreateTicketSystems,
  useDeleteTicketSystems,
  useGetAllTicketSystems,
  useUpdateTicketSystems,
} from "@api/manage";
import { Helmet } from "react-helmet";
import FormSearchSystem from "components/form-search/FormSearchSystem";

const Systems = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusSystem: undefined,
    searchSystem: undefined,
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllTicketSystems(
    {
      page: page - 1,
      size: 10,
      "status.equals": dataSearch.statusSystem,
      "name.contains": dataSearch.searchSystem,
      sort: "name,asc",
    },
    { query: { enabled: false } }
  );
  console.log(data);
  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateSystem,
    isSuccess: successUpdate,
  } = useUpdateTicketSystems();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createSystem,
    isSuccess: successCreate,
  } = useCreateTicketSystems();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteSystem } =
    useDeleteTicketSystems();

  const confirmDelete = (id) => {
    deleteSystem({ id })
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
      title: "Tên hệ thống",
      align: "center",
      dataIndex: "name",
    },
    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return SystemStatusRender(value);
        // return getSystemStatusLabel(value);
      },
    },
    {
      key: (value, record) => `description${value}${record.id}`,
      title: "Mô tả",
      align: "center",
      dataIndex: "description",
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
          <SystemForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataSystem}
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

  const saveDataSystem = (type, dataSystem) => {
    // transform status string to number
    dataSystem.status = dataSystem.status === "true";
    if (type === "add") {
      // call api create new doc type
      createSystem({ data: dataSystem })
        .then(() => {
          // notification success update System
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công hệ thống : ${dataSystem.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateSystem({ id: dataSystem.id, data: dataSystem })
        .then(() => {
          // notification success update System
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công hệ thống : ${dataSystem.name}`,
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
      <Helmet title="Quản lý hệ thống" />
      <Card
        title={
          <>
            <i className="fe fe-layers mr-2" />{" "}
            <strong>QUẢN LÝ HỆ THỐNG</strong>
          </>
        }
        extra={
          <SystemForm
            type="add"
            data={{
              name: "",
              description: "",
              status: true,
            }}
            isSuccess={successCreate}
            loadingSave={isLoadingCreate}
            saveData={saveDataSystem}
          />
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchSystem setDataSearch={setDataSearch} />
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

export default Systems;
