/* eslint-disable react-hooks/exhaustive-deps */
import { Card, notification, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import { Helmet } from "react-helmet";
import { FORMAT_DATE } from "services/utils/constants";

import FileForm from "components/files/FileForm";
import FormSearchFile from "components/form-search/FormSearchFile";
import FilePreview from "components/files/FilePreview";
import { useEditFile, useGetAllFiles, useGetListAgents } from "@api/manage";
import FileDownload from "components/files/FileDownload";

const Files = () => {
  const [page, setPage] = useState(1);
  const [dataSearch, setDataSearch] = useState({
    searchFile: undefined,
    agentFile: undefined,
    docTypeFile: undefined,
    docGroupFile: undefined,
    fromDate: undefined,
    toDate: undefined,
  });
  const [dataSearchAgent, setDataSearchAgent] = useState({
    searchAgentA1: [],
    searchAgentUser: [],
  });
  // hook get all doc types
  const { isFetching, refetch, data } = useGetAllFiles(
    {
      page,
      size: 10,
      doctypes: dataSearch.docTypeFile,
      query: dataSearch.searchFile,
      agents: dataSearch.agentFile,
      docgroups: dataSearch.docGroupFile
        ? dataSearch.docGroupFile.flat()
        : undefined,
      from: dataSearch.fromDate,
      to: dataSearch.toDate,
    },
    { query: { enabled: false } }
  );

  // hook update
  const {
    isLoading: isLoadingUpdate,
    mutateAsync: updateFile,
    isSuccess: successUpdate,
  } = useEditFile();

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
      title: "Tên file",
      align: "center",
      dataIndex: "name",
    },

    {
      key: (value, record) => `path${value}${record.id}`,
      title: "Đường dẫn",
      align: "center",
      dataIndex: "path",
    },

    {
      key: (value, record) => `extention${value}${record.id}`,
      title: "Loại văn bản",
      align: "center",
      dataIndex: "extension",
    },

    {
      key: (record) => `docGroup${record.id}`,
      title: "Nhóm văn bản",
      align: "center",
      render(record) {
        return <span>{record.docgroup.name}</span>;
      },
    },

    {
      key: (record) => `agent${record.id}`,
      title: "Đơn vị",
      align: "center",
      render(record) {
        return <span>{record.agent.name}</span>;
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
          {1024 * process.env.REACT_APP_MAXSIZEPREVIEW > record?.size && (
            <FilePreview id={record.id} item={record} />
          )}
          <FileDownload id={record.id} />
          <FileForm
            loadingSave={isLoadingUpdate}
            saveData={saveDataFile}
            type="edit"
            isSuccess={successUpdate}
            data={{ ...record }}
          />
        </Space>
      ),
    },
  ];

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

  const onChange = (e) => {
    setPage(e.current);
  };

  const saveDataFile = (type, dataFile) => {
    // transform status string to number
    dataFile.status = Number(dataFile.status);
    // call api update doc type
    updateFile({ id: dataFile.id, data: dataFile })
      .then(() => {
        // notification success update dFile
        notification.success({
          message: "Cập nhật thành công",
          description: `Bạn đã cập nhật thành công file : ${dataFile.name}`,
        });
        refetch();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getAllA1().then((res) => {
      // transform multiple array to single array

      getAllUser().then((res1) => {
        const tmpData = [...res1?.data?.flat()];
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
      <Helmet title="Quản lý file" />
      <Card
        title={
          <>
            <i className="fe fe-file-text mr-2" /> <strong>QUẢN LÝ FILE</strong>
          </>
        }
        style={{
          width: "100%",
        }}
      >
        <Row>
          <FormSearchFile
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

export default Files;
