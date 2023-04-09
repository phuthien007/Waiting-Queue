/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Button,
  Modal,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FORMAT_DATE } from "services/utils/constants";
import moment from "moment";
import {
  CheckOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  useCreateEmailCollection,
  useDeleteEmailCollectionById,
  useEditEmailCollection,
  useGetAllEmailCollections,
} from "@api/document";
import EmailCollectionForm from "./ListEmailForm";

const ListEmail = ({ formDocument }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllEmailCollections(
    {
      page,
      size: 10,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateEmailCollection,
    isSuccess: successUpdate,
  } = useEditEmailCollection();
  // hook add
  const {
    isLoading: isLoadingCreate,
    mutateAsync: createEmailCollection,
    isSuccess: successCreate,
  } = useCreateEmailCollection();

  // hook delete
  const { isLoading: isLoadingDelete, mutateAsync: deleteEmailCollection } =
    useDeleteEmailCollectionById();

  const confirmDelete = (id) => {
    deleteEmailCollection({ id })
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
      key: (record) => `path${record.id}`,
      title: "Tên danh sách",
      align: "center",
      dataIndex: "name",
    },
    {
      key: (record) => `path${record.id}`,
      title: "Ngày tạo",
      align: "center",
      dataIndex: "createDate",
      render(value) {
        return moment(value).format(FORMAT_DATE);
      },
    },
    {
      key: (record) => `path${record.id}`,
      title: "Thao tác",
      fixed: "right",
      align: "center",
      render(record) {
        return (
          <Space>
            <Tooltip title="Chọn">
              <Button
                style={{ backgroundColor: "green" }}
                shape="circle"
                onClick={() => handleSelect(record)}
                icon={<CheckOutlined style={{ color: "white" }} />}
              />
            </Tooltip>
            <EmailCollectionForm
              loadingSave={isLoadingUpdate}
              saveData={saveDataEmailCollection}
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
                <Button
                  type="danger"
                  shape="circle"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const onChange = (e) => {
    setPage(e.current);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const saveDataEmailCollection = (type, dataEmailCollection) => {
    // transform status string to number
    dataEmailCollection.status = Number(dataEmailCollection.status);

    if (type === "add") {
      // call api create new doc type
      createEmailCollection({ data: dataEmailCollection })
        .then(() => {
          // notification success update EmailCollection
          notification.success({
            message: "Tạo mới thành công",
            description: `Bạn đã thêm mới thành công danh sách email : ${dataEmailCollection.name}`,
          });
          setPage(1);
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // call api update doc type
      updateEmailCollection({
        id: dataEmailCollection.id,
        data: dataEmailCollection,
      })
        .then(() => {
          // notification success update EmailCollection
          notification.success({
            message: "Cập nhật thành công",
            description: `Bạn đã cập nhật thành công danh sách email : ${dataEmailCollection.name}`,
          });
          refetch();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const handleSelect = (record) => {
    formDocument.setFieldValue("emailCC", record.cc);
    formDocument.setFieldValue("emailBCC", record.bcc);

    handleOk();
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <>
      <Link to="#" style={{ color: "blue" }} onClick={showModal}>
        <Space>
          <i className="fe fe-search mr-2" />
          <span>Chọn từ danh sách</span>
        </Space>
      </Link>
      <Modal
        title="QUẢN LÝ DANH SÁCH EMAIL"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width="70%"
      >
        <Row style={{ justifyContent: "flex-end" }} className="mb-2">
          {/* <Col>
            <Space>
              <Label className="mt-2">Tìm kiếm:</Label>
              <Input.Search placeholder="Từ khóa" />
            </Space>
          </Col> */}

          <EmailCollectionForm
            type="add"
            data={{}}
            isSuccess={successCreate}
            loadingSave={isLoadingCreate}
            saveData={saveDataEmailCollection}
          />
        </Row>

        <Table
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
      </Modal>
    </>
  );
};

export default ListEmail;
