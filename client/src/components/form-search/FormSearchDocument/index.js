/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent */
import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Input, Select, TreeSelect } from "antd";
import { useSelector } from "react-redux";
import { useGetDocgroupsDepartment, useGetListDocTypes } from "@api/manage";
import {
  DB_DOCUMENT_STATUS_NEW,
  DB_DOCUMENT_STATUS_CONFIRMED,
  DB_DOCUMENT_STATUS_DELETED,
  DB_DOCUMENT_STATUS_RELEASE,
  DB_DOCUMENT_STATUS_REVOKED,
  DB_DOCUMENT_STATUS_REVOKED_BY_A1,
} from "services/utils/constants";
import { removeVietnameseTones } from "services/utils/validates";
import { selectUser } from "store/userSlice";

const { SHOW_PARENT } = TreeSelect;
const FormSearchDocument = ({ setDataSearch, dataSearch, dataSearchAgent }) => {
  const { role } = useSelector(selectUser);
  const [form] = Form.useForm();
  const [docgroups, setDocgroups] = useState([]);
  const { refetch: refetchGetDocType, data: dataGetDocType } =
    useGetListDocTypes({
      query: {
        enabled: false,
      },
    });
  const {
    refetch: refetchGetDocGroupDepartment,
    data: dataGetDocGroupDepartment,
  } = useGetDocgroupsDepartment(
    { its: true },
    {
      query: {
        enabled: false,
      },
    }
  );

  const onChange = (newValue) => {
    setDocgroups(newValue);
  };
  const handleSearch = (values) => {
    values.searchDocument = values.searchDocument?.trim();
    setDataSearch({
      ...dataSearch,
      ...values,
      docGroupDocument: docgroups?.map((item) => item.split(";")) || undefined,
    });
  };
  const resetForm = () => {
    form.resetFields();
    setDocgroups([]);
    setDataSearch({
      ...form.getFieldsValue(),
      dockeeper: dataSearch.dockeeper,
    });
  };

  const tProps = {
    treeData: dataGetDocGroupDepartment || [],
    docgroups,
    onChange,
    maxTagCount: 2,
    filterTreeNode: (inputValue, treeNode) => {
      return (
        removeVietnameseTones(treeNode.title.toLowerCase()).indexOf(
          removeVietnameseTones(inputValue.toLowerCase())
        ) >= 0
      );
    },
    treeCheckable: true,
    allowClear: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Nhóm văn bản",
    style: {
      width: 200,
    },
  };

  useEffect(() => {
    refetchGetDocType();
    refetchGetDocGroupDepartment();
  }, []);

  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item label="Tìm kiếm" name="searchDocument">
            <Input placeholder="Từ khóa" />
          </Form.Item>
        </Col>

        <Col hidden={!role.includes("A1")}>
          <Form.Item name="agentDocument">
            <Select
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              mode="multiple"
              maxTagCount={2}
              allowClear
              placeholder="Đơn vị"
              style={{ width: 250 }}
            >
              <Select.OptGroup key="A1" label="A1">
                {dataSearchAgent?.searchAgentA1.length
                  ? dataSearchAgent.searchAgentA1.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>

              <Select.OptGroup key="User" label="Đơn vị">
                {dataSearchAgent?.searchAgentUser.length
                  ? dataSearchAgent.searchAgentUser.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="docGroupDocument">
            <TreeSelect {...tProps} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name="docTypeDocument">
            <Select
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              maxTagCount={1}
              allowClear
              placeholder="Loại văn bản"
              style={{ width: 150 }}
            >
              <Select.OptGroup key="doc-type" label="Loại văn bản">
                {dataGetDocType?.length
                  ? dataGetDocType.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusDocument">
            <Select allowClear placeholder="Trạng thái" style={{ width: 150 }}>
              <Select.OptGroup key="doc-type" label="Trạng thái">
                <Select.Option key={DB_DOCUMENT_STATUS_NEW}>
                  Văn bản mới
                </Select.Option>
                <Select.Option key={DB_DOCUMENT_STATUS_CONFIRMED}>
                  Văn bản đã xác nhận
                </Select.Option>
                <Select.Option key={DB_DOCUMENT_STATUS_REVOKED}>
                  Đã thu hồi
                </Select.Option>
                <Select.Option key={DB_DOCUMENT_STATUS_RELEASE}>
                  Đã phát hành
                </Select.Option>
                <Select.Option key={DB_DOCUMENT_STATUS_REVOKED_BY_A1}>
                  Đã thu hồi ( sau phát hành )
                </Select.Option>
                <Select.Option key={DB_DOCUMENT_STATUS_DELETED}>
                  Đã xóa
                </Select.Option>
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusRead">
            <Select
              allowClear
              placeholder="Trạng thái văn bản"
              style={{ width: 180 }}
            >
              <Select.OptGroup key="doc-type" label="Trạng thái văn bản">
                <Select.Option key="0">Chưa đọc</Select.Option>
                <Select.Option key="2">Đã đọc</Select.Option>
                <Select.Option key="1">Mới thay đổi</Select.Option>
                {role.includes("DOC_KEEPER") && (
                  <Select.Option key="3">Đã gửi lên D-Office</Select.Option>
                )}
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col>

        <Col hidden={!role.includes("A1")}>
          <Form.Item name="dueDate">
            <Select
              allowClear
              placeholder="Hạn hoàn thành"
              style={{ width: 150 }}
            >
              <Select.OptGroup key="doc-type" label="Hạn hoàn thành">
                <Select.Option key="1">Sắp đến hạn</Select.Option>
                <Select.Option key="0">Đến hạn</Select.Option>
                <Select.Option key="-1">Quá hạn</Select.Option>
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col>

        <Col>
          <Form.Item>
            <Button htmlType="submit" className="mr-2" type="primary">
              <i className="fe fe-search mr-2" />
              Tìm kiếm
            </Button>
            <Button onClick={resetForm} danger>
              <i className="fe fe-x mr-2 mt-2" />
              Hủy bỏ
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormSearchDocument;
