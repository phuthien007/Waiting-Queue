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
import DocGroupForm from "components/administration/DocGroupForm";
import { DocGroupStatusRender } from "services/utils/format";
import {
  useCreateDocGroup,
  useDeleteDocGroupById,
  useEditDocGroup,
  useGetAllDocGroups,
} from "@api/manage";
import { Helmet } from "react-helmet";
import FormSearchDocGroup from "components/form-search/FormSearchDocGroup";

const DocGroups = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusDocGroup: undefined,
    searchDocGroup: undefined,
    departmentDocGroup: undefined,
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllDocGroups(
    {
      page,
      size: 10,
      status: dataSearch.statusDocGroup,
      query: dataSearch.searchDocGroup,
      department: dataSearch.departmentDocGroup,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateDocGroup,
    isSuccess: successUpdate,
  } = useEditDocGroup();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createDocGroup,
    isSuccess: successCreate,
  } = useCreateDocGroup();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteDocGroup } =
    useDeleteDocGroupById();

  const confirmDelete = (id) => {
    deleteDocGroup({ id })
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
      title: "Tên nhóm văn bản",
      align: "center",
      dataIndex: "name",
    },
    {
      key: (value, record) => `name${value}${record.id}`,
      title: "Phòng quản lý",
      align: "center",
      dataIndex: "department",
    },

    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return DocGroupStatusRender(value);
        // return getDocGroupStatusLabel(value);
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
          <DocGroupForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataDocGroup}
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

  const saveDataDocGroup = (type, dataDocGroup) => {
    // transform status string to number
    dataDocGroup.status = Number(dataDocGroup.status);
    if (type === "add") {
      // call api create new doc type
      createDocGroup({ data: dataDocGroup })
        .then(() => {
          // notification success update docGroup
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công nhóm văn bản : ${dataDocGroup.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateDocGroup({ id: dataDocGroup.id, data: dataDocGroup })
        .then(() => {
          // notification success update docGroup
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công nhóm văn bản : ${dataDocGroup.name}`,
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
      <Helmet title="Quản lý nhóm văn bản" />
      <Card
        title={
          <>
            <i className="fe fe-book mr-2" />{" "}
            <strong>QUẢN LÝ NHÓM VĂN BẢN</strong>
          </>
        }
        extra={
          <DocGroupForm
            type="add"
            data={{
              name: "",
              description: "",
              status: 1,
            }}
            loadingSave={isLoadingCreate}
            saveData={saveDataDocGroup}
            isSuccess={successCreate}
          />
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchDocGroup setDataSearch={setDataSearch} />
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

export default DocGroups;
