import {
  useTenantsControllerCreateTenant,
  useTenantsControllerFindAllTenant,
  useTenantsControllerUpdateTenant,
  useUsersControllerFindAllUser,
} from "@api/waitingQueue";
import { Card, Col, Divider, notification, Row, Table } from "antd";
import Search from "antd/lib/input/Search";
import TenantForm from "components/administration/TenantForm";
// import FormAccount from 'components/admin/managements/FormAccount'
import _, { toInteger } from "lodash";
import React, { useEffect, useState } from "react";
// import { CSVLink } from 'react-csv'
import { Helmet } from "react-helmet";
import { DEFAULT_PAGE_SIZE } from "services/utils/constants";
import { RoleRender, StatusRender } from "services/utils/format";

function ManagementTenants() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading: loadingCreate, mutateAsync: createTenant } =
    useTenantsControllerCreateTenant();
  const { isLoading: loadingUpdate, mutateAsync: updateTenant } =
    useTenantsControllerUpdateTenant();
  const {
    refetch,
    isFetching,
    data: dataTenant,
  } = useTenantsControllerFindAllTenant({
    like: keyword ? [`contactEmail:${keyword}`] : [],
    page: page,
    size: DEFAULT_PAGE_SIZE,
    sort: ["createdAt,desc"],
  });

  const columns = [
    {
      title: "Tên công ty",
      dataIndex: "name",
      key: (record) => `name_${record.id}`,
    },
    {
      title: "Email liên hệ",
      dataIndex: "contactEmail",
      key: (record) => `email_${record.id}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "contactPhone",
      key: (record) => `phone_${record.id}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: (record) => `status_${record.id}`,
      render: (value) => StatusRender(value),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: (record) => `description_${record.id}`,
    },

    {
      title: "Hành động",
      fixed: "right",
      width: 100,
      key: (record) => `eactions_${record.id}`,
      render: (record) => {
        return (
          <>
            <TenantForm
              reloadData={handleReloadData}
              saveData={updateTenant}
              loading={loadingUpdate}
              type="edit"
              data={record}
            />
          </>
        );
      },
    },
  ];

  const onSearch = (value) => {
    setKeyword(value);
    setPage(1);
  };

  const handleReloadData = () => {
    setPage(1);
    refetch();
    setKeyword("");
  };

  useEffect(() => {
    refetch();
  }, [keyword, page]);

  return (
    <>
      <Helmet title="Management Account" />{" "}
      <Row>
        <Col span={24}>
          <h2>Danh sách đối tác</h2>
          <Divider />
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Search
            allowClear
            placeholder="Tìm kiếm theo email"
            onSearch={onSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
          {" "}
          <TenantForm
            saveData={createTenant}
            loading={loadingCreate}
            type="add"
            reloadData={handleReloadData}
            data={{
              status: 1,
              isWorking: true,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Card style={{ width: "100%" }}>
          <Table
            scroll={{ x: 1200 }}
            rowKey="id"
            loading={isFetching}
            style={{ width: "100%" }}
            dataSource={dataTenant?.data || []}
            columns={columns}
            pagination={{
              current: _.toSafeInteger(dataTenant?.pagination.page) || 1,
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: false,
              total: dataTenant?.pagination.total || 0,
            }}
            onChange={(pagination) => {
              setPage(pagination.current);
            }}
          />
        </Card>
      </Row>
    </>
  );
}

export default ManagementTenants;
