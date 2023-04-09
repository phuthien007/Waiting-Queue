/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
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

const { SHOW_PARENT } = TreeSelect;
const { RangePicker } = DatePicker;

const FormSearchDocumentPublish = ({ setDataSearch, currentDataSearch }) => {
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
      ...currentDataSearch,
      ...values,
      docGroupPublishDocument:
        docgroups?.map((item) => item.split(";")) || undefined,
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
    setDataSearch({
      ...form.getFieldsValue(),
      dockeeper: currentDataSearch.dockeeper,
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
          <Form.Item label="Tìm kiếm" name="searchPublishDocument">
            <Input placeholder="Từ khóa" />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name="docGroupPublishDocument">
            <TreeSelect {...tProps} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name="docTypePublishDocument">
            <Select
              mode="multiple"
              maxTagCount={1}
              allowClear
              placeholder="Loại văn bản"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
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
          <Form.Item name="dateSearch">
            <RangePicker format={FORMAT_DATE} />
          </Form.Item>
        </Col>

        {/* <Col>
          <Form.Item name="dueDate">
            <Select allowClear placeholder="Hạn hoàn thành" style={{ width: 150 }}>
              <Select.OptGroup key="doc-type" label="Hạn hoàn thành">
                <Select.Option key="1">Sắp đến hạn</Select.Option>
                <Select.Option key="0">Đến hạn</Select.Option>
                <Select.Option key="-1">Quá hạn</Select.Option>
              </Select.OptGroup>
            </Select>
          </Form.Item>
        </Col> */}

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

export default FormSearchDocumentPublish;
