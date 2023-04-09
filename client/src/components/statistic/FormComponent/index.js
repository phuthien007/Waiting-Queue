/* eslint-disable react-hooks/exhaustive-deps */
import { useGetListAgents } from "@api/manage";
import { Button, Card, Row, Space, Table } from "antd";
import FormSearchStatistic from "components/form-search/FormSearchStatistic";
import { useEffect, useState } from "react";

const FormComponent = ({
  title,
  data,
  setDataSearch,
  page,
  setPage,
  isFetching,
  exportExcel,
  exportPdf,
}) => {
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
      title: "Đơn vị",
      dataIndex: "name",
      key: "agent",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "qty",
    },
  ];

  const onChange = (e) => {
    setPage(e.current);
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
  return (
    <Card
      title={
        <>
          <i className="fa fa-bar-chart mr-2" /> <b>{title.toUpperCase()}</b>
        </>
      }
      extra={
        <Space>
          <Button
            style={{ backgroundColor: "#358517", color: "white" }}
            icon={<i className="fa fa-file-excel-o mr-2" />}
            target="_blank"
            onClick={() => {
              exportExcel();
            }}
          >
            Xuất EXCEL
          </Button>
          <Button
            target="_blank"
            onClick={() => {
              exportPdf();
            }}
            style={{ backgroundColor: "#AA0000", color: "white" }}
            icon={<i className="fa fa-file-pdf-o mr-2" />}
          >
            Xuất PDF
          </Button>
        </Space>
      }
    >
      <Row>
        <FormSearchStatistic
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
          total: data ? data?.pagination.totalElements : 0,
          showSizeChanger: false,
        }}
        onChange={onChange}
        loading={isFetching}
        dataSource={data?.content || []}
      />
    </Card>
  );
};

export default FormComponent;
