import { useGetAllAccounts, useGetListAgents } from "@api/manage";
import { Button, Form, Modal, Row, Table, Tag } from "antd";
import FormSearchAccount from "components/form-search/FormSearchAccount";
import { useState, useEffect } from "react";
import _ from "lodash";
import { DB_USER_STATUS_ACTIVE } from "services/utils/constants";

const SelectAccountForm = ({ setData, data: dataSelectToShare }) => {
  const [page, setPage] = useState(1);
  const [dataSelected, setDataSelected] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [dataSearch, setDataSearch] = useState({
    statusAccount: undefined,
    searchAccount: undefined,
    agentAccount: undefined,
  });

  // rowSelection objects indicates the need for row selection

  // hook get all account
  const { isFetching, refetch, data, isSuccess } = useGetAllAccounts(
    {
      page,
      size: 10,
      status: DB_USER_STATUS_ACTIVE,
      query: dataSearch.searchAccount,
      agents: dataSearch.agentAccount,
    },
    { query: { enabled: false } }
  );
  const showModal = () => {
    form.resetFields();
    // setDataSelected([]);
    // setDataSelect([]);
    // setDataSelect(dataSelectToShare);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setData([
      // ...dataSelectToShare,
      ...dataSelect,
      ...dataSelected,
    ]);

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
  ];
  const onChange = (e) => {
    // save only new dataSelected

    setPage(e.current);
  };

  // useEffect(() => {

  // }, [dataSelect, dataSelectToShare]);

  useEffect(() => {
    // set selected key into dataSelected and remove selected key from dataSelect if each item in dataSelect is in data by id
    // initial dataSelected
    if (isSuccess && isFetching === false) {
      setDataSelected(
        dataSelect.filter((item) =>
          data?.content.map((i) => i.id).includes(item.id)
        )
      );
      // truncate dataSelect follow page
      setDataSelect(
        dataSelect.filter(
          (item) => !data?.content.map((i) => i.id).includes(item.id)
        )
      );
    }
  }, [isSuccess, isFetching]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refetch();
    setDataSelect((prev) => [...prev, ...dataSelected]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dataSearch]);

  return (
    <>
      <Button
        onClick={showModal}
        icon={<i className="fe fe-search mr-2" />}
        type="link"
      >
        {" "}
        Chọn{" "}
      </Button>
      <Modal
        // footer={null}
        title="Phát hành văn bản"
        open={isModalOpen}
        width="80%"
        onOk={handleOk}
        destroyOnClose={true}
        okText="Chọn"
        onCancel={handleCancel}
      >
        <Row>
          <FormSearchAccount
            type="publish"
            dataSearch={dataSearchAgent}
            setDataSearch={setDataSearch}
          />
        </Row>
        <Row>
          {[...dataSelect, ...dataSelected].length ? (
            <Row>
              <h5>Các tài khoản được chọn: </h5>
              <Row style={{ width: "100%" }}>
                {[...dataSelect, ...dataSelected].map((item) => (
                  <Tag
                    closable
                    closeIcon={
                      <i className="fe fe-x" style={{ color: "red" }} />
                    }
                    onClose={() => {
                      setDataSelect((prev) =>
                        prev.filter((i) => i.id !== item.id)
                      );
                      setDataSelected((prev) =>
                        prev.filter((i) => i.id !== item.id)
                      );
                    }}
                    key={item.id}
                    className="mt-2 mb-2"
                    color="blue"
                  >
                    {item.fullName}
                  </Tag>
                ))}{" "}
              </Row>
              <Row style={{ width: "100%" }}>
                <Button
                  onClick={() => {
                    setDataSelect([]);
                    setDataSelected([]);
                  }}
                  style={{ color: "orange" }}
                  className="mb-2"
                  danger
                >
                  Bỏ tất cả lựa chọn
                </Button>
              </Row>
            </Row>
          ) : (
            <span>Chưa chọn tài khoản nào!</span>
          )}
        </Row>
        <Table
          scroll={{ x: 1000 }}
          rowKey="id"
          columns={columns}
          // row selection
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: dataSelected.map((item) => item.id),
            // check function select to indecate row is checked or unchecked
            onSelect: (record, selected, selectedRows) => {
              if (selected) {
                setDataSelected([...dataSelected, record]);
              } else {
                setDataSelected(
                  dataSelected.filter((item) => item.id !== record.id)
                );
              }
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              if (selected) {
                setDataSelected([...dataSelected, ...changeRows]);
              } else {
                setDataSelected(
                  dataSelected.filter(
                    (item) => !changeRows.map((i) => i.id).includes(item.id)
                  )
                );
              }
            },
          }}
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
export default SelectAccountForm;
