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
import DocTypeForm from "components/administration/DocTypeForm";
import { DocTypeStatusRender } from "services/utils/format";
import {
  useCreateDocType,
  useDeleteDocTypeById,
  useEditDocType,
  useGetAllDocTypes,
} from "@api/manage";
import { Helmet } from "react-helmet";
import FormSearchDocType from "components/form-search/FormSearchDocType";

const DocTypes = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    statusDocType: undefined,
    searchDocType: undefined,
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllDocTypes(
    {
      page,
      size: 10,
      status: dataSearch.statusDocType,
      query: dataSearch.searchDocType,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateDocType,
    isSuccess: successUpdate,
  } = useEditDocType();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createDocType,
    isSuccess: successCreate,
  } = useCreateDocType();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteDocType } =
    useDeleteDocTypeById();

  const confirmDelete = (id) => {
    deleteDocType({ id })
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
      title: "Tên loại văn bản",
      align: "center",
      dataIndex: "name",
    },
    {
      key: (value, record) => `code${value}${record.id}`,
      title: "Mã",
      dataIndex: "code",
      align: "center",
    },
    {
      key: (value, record) => `status${value}${record.id}`,
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      render(value) {
        return DocTypeStatusRender(value);
        // return getDocTypeStatusLabel(value);
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
          <DocTypeForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataDocType}
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
              onConfirm={() => confirmDelete(record.id)}
              okText="Xóa"
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

  const saveDataDocType = (type, dataDocType) => {
    // transform status string to number
    dataDocType.status = Number(dataDocType.status);
    if (type === "add") {
      // call api create new doc type
      createDocType({ data: dataDocType })
        .then(() => {
          // notification success update doctype
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công loại văn bản : ${dataDocType.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateDocType({ id: dataDocType.id, data: dataDocType })
        .then(() => {
          // notification success update doctype
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công loại văn bản : ${dataDocType.name}`,
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
      <Helmet title="Quản lý loại văn bản" />
      <Card
        title={
          <>
            <i className="fe fe-shuffle mr-2" />{" "}
            <strong>QUẢN LÝ LOẠI VĂN BẢN</strong>
          </>
        }
        extra={
          <DocTypeForm
            type="add"
            data={{
              name: "",
              code: "",
              description: "",
              status: 1,
              maxSize: 0,
              extensions: [],
            }}
            isSuccess={successCreate}
            loadingSave={isLoadingCreate}
            saveData={saveDataDocType}
          />
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchDocType setDataSearch={setDataSearch} />
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

export default DocTypes;
