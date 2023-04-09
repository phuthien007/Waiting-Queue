/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import { useEffect } from "react";
import { Form, Button, Row, Col, Select, DatePicker } from "antd";
import { FORMAT_DATE } from "services/utils/constants";
import { useGetListDocTypes } from "@api/manage";
import moment from "moment";
import { removeVietnameseTones } from "services/utils/validates";

const { RangePicker } = DatePicker;
const FormSearchStatistic = ({ setDataSearch, dataSearch }) => {
  const [form] = Form.useForm();
  const { refetch: refetchGetDocType, data: dataGetDocType } =
    useGetListDocTypes({
      query: {
        enabled: false,
      },
    });

  const handleSearch = (values) => {
    values.searchFile = values.searchFile?.trim();
    setDataSearch({
      ...values,
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
    setDataSearch({ ...form.getFieldsValue() });
  };

  useEffect(() => {
    refetchGetDocType();
  }, []);

  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item name="agentStatistic">
            <Select
              mode="multiple"
              maxTagCount={2}
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              allowClear
              placeholder="Đơn vị"
              style={{ width: 250, marginBottom: 10 }}
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
          <Form.Item name="docTypeStatistic">
            <Select
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              mode="multiple"
              maxTagCount={1}
              allowClear
              placeholder="Loại văn bản"
              style={{ width: 150, marginBottom: 10 }}
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

export default FormSearchStatistic;
