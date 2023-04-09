/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Input,
  Select,
  TreeSelect,
  DatePicker,
} from "antd";
import { FORMAT_DATE } from "services/utils/constants";
import { useGetDocgroupsDepartment, useGetListDocTypes } from "@api/manage";
import moment from "moment";
import { removeVietnameseTones } from "services/utils/validates";

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

const FormSearchFile = ({ setDataSearch, dataSearch }) => {
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
    {
      its: false,
    },
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
    values.searchFile = values.searchFile?.trim();
    setDataSearch({
      ...values,
      docGroupFile: docgroups?.map((item) => item.split(";")) || undefined,
      fromDate: values.dateSearch?.length
        ? moment(values.dateSearch[0]._d).startOf("day").toISOString()
        : undefined,
      toDate: values.dateSearch?.length
        ? moment(values.dateSearch[1]._d).endOf("day").toISOString()
        : undefined,
    });
  };
  const resetForm = () => {
    form.resetFields();
    setDocgroups([]);
    setDataSearch({ ...form.getFieldsValue() });
  };
  const tProps = {
    treeData: dataGetDocGroupDepartment || [],
    docgroups,
    onChange,
    maxTagCount: 2,
    treeCheckable: true,
    filterTreeNode: (inputValue, treeNode) => {
      return (
        removeVietnameseTones(treeNode.title.toLowerCase()).indexOf(
          removeVietnameseTones(inputValue.toLowerCase())
        ) >= 0
      );
    },
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
          <Form.Item label="Tìm kiếm" name="searchFile">
            <Input placeholder="Từ khóa" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="agentFile">
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
                {dataSearch?.searchAgentA1.length
                  ? dataSearch.searchAgentA1.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>

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
          <Form.Item name="docTypeFile">
            <Select
              mode="multiple"
              maxTagCount={1}
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
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
          <Form.Item name="docGroupFile">
            <TreeSelect {...tProps} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name="dateSearch">
            <RangePicker format={FORMAT_DATE} />
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

export default FormSearchFile;
