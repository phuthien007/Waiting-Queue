/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useGetStatisticAccounts } from "@api/manage";
import { Button, Card, Modal, Row, Table } from "antd";
import FormSearchAuthorityMap from "components/form-search/FormSearchAuthorityMap";
import { useState, useEffect } from "react";

const AuthorityMap = ({ dataSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [dataSearchAuthority, setDataSearchAuthority] = useState({
    searchAuthorityAccount: undefined,
    agentAuthorityAccount: undefined,
    docGroupAuthorityAccount: undefined,
    statusAuthorityAccount: undefined,
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetStatisticAccounts(
    {
      page,
      size: 10,
      query: dataSearchAuthority.searchAuthorityAccount,
      agents: dataSearchAuthority.agentAuthorityAccount,
      docgroups: dataSearchAuthority.docGroupAuthorityAccount,
      status: dataSearchAuthority.statusAuthorityAccount,
    },
    { query: { enabled: false } }
  );

  const columns = [
    {
      key: (record) => `serialNumber${record.key}${Math.random()}`,
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
            ? data?.content.findIndex((item) => item === record) + 1
            : (page - 1) * 10 +
              data.content.findIndex((item) => item === record) +
              1}
        </span>
      ),
    },

    {
      key: (value, record) => `name${value}${record.key}${Math.random()}`,
      title: "Họ tên",
      align: "center",
      dataIndex: "fullName",
    },
    {
      key: (value, record) => `username${value}${record.key}${Math.random()}`,
      title: "Tên đăng nhập",
      align: "center",
      dataIndex: "userName",
    },
    {
      key: (value, record) => `email${value}${record.key}${Math.random()}`,
      title: "Email",
      align: "center",
      dataIndex: "email",
    },
    {
      key: (value, record) => `email${value}${record.key}${Math.random()}`,
      title: "Đơn vị",
      align: "center",
      dataIndex: "agentName",
    },
    {
      key: (value, record) => `doc-group${value}${record.key}${Math.random()}`,
      title: "Nhóm văn bản",
      align: "center",
      dataIndex: "userGroup",
    },
    {
      key: (value, record) =>
        `receiveReport${value}${record.key}${Math.random()}`,
      title: "A1 nhận báo cáo",
      align: "center",
      dataIndex: "managers",
      render(value) {
        if (value) {
          return value
            .split(";")
            .filter((v) => !!v)
            .map((v) => (
              <div key={`${Math.random()}`}>
                <i key={`${Math.random()}`} className="fe fe-user mr-2" /> {v}
              </div>
            ));
        }

        return value;
      },
    },
  ];

  const onChange = (e) => {
    setPage(e.current);
  };
  const showModal = () => {
    const tmp = [];
    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];
      for (
        let indexSecond = 0;
        indexSecond < element.groups.length;
        indexSecond += 1
      ) {
        const group = element.groups[indexSecond];
        tmp.push({ ...element, groups: group });
      }
    }
    refetch();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [dataSearchAuthority, page]);

  return (
    <>
      <Button icon={<i className="fe fe-git-merge mr-2" />} onClick={showModal}>
        Sơ đồ phân quyền
      </Button>
      <Modal
        width="90%"
        title="Sơ đồ phân quyền tài khoản theo nhóm văn bản"
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        onCancel={handleCancel}
      >
        <Row>
          <FormSearchAuthorityMap
            dataSearch={dataSearch}
            setDataSearch={setDataSearchAuthority}
          />
        </Row>
        <Card className="mt-4">
          <Table
            key="key"
            scroll={{ x: 1000 }}
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
      </Modal>
    </>
  );
};

export default AuthorityMap;
