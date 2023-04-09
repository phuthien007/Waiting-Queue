/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-indent */
import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Input, Select, TreeSelect } from "antd";
import { useGetDocgroupsDepartment } from "@api/manage";
import { removeVietnameseTones } from "services/utils/validates";

const { SHOW_PARENT } = TreeSelect;

const FormSearchAuthorityMap = ({ dataSearch, setDataSearch }) => {
  const [form] = Form.useForm();
  const [docgroups, setDocGroups] = useState([]);
  const onChange = (newValue) => {
    setDocGroups(newValue);
  };
  const {
    refetch: refetchGetDocGroupDepartment,
    data: dataGetDocGroupDepartment,
  } = useGetDocgroupsDepartment(
    {
      its: false,
    },
    {
      query: {
        enabled: false,
      },
    }
  );
  const handleSearch = (values) => {
    values.searchAuthorityAccount = values.searchAuthorityAccount?.trim();
    setDataSearch({
      ...values,
      docGroupAuthorityAccount:
        docgroups?.map((item) => item.split(";")).flat() || undefined,
    });
  };
  const resetForm = () => {
    form.resetFields();
    setDocGroups([]);
    setDataSearch({ ...form.getFieldsValue() });
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
    refetchGetDocGroupDepartment();
  }, []);
  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item name="searchAuthorityAccount" label="Tìm kiếm">
            <Input placeholder="Từ khóa" style={{ width: 150 }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="agentAuthorityAccount">
            <Select
              mode="multiple"
              maxTagCount={2}
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              allowClear
              placeholder="Đơn vị"
              style={{ width: 250 }}
            >
              <Select.OptGroup key="User" label="Đơn vị">
                {dataSearch?.searchAgentUser.length
                  ? dataSearch.searchAgentUser.map((item) => (
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
          <Form.Item name="docGroupAuthorityAccount">
            <TreeSelect className="mr-2" {...tProps} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusAuthorityAccount">
            <Select style={{ width: 200 }} allowClear placeholder="Trạng thái">
              <Select.Option value={0}>Không có A1 nhận báo cáo</Select.Option>
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

export default FormSearchAuthorityMap;
