/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Form, Button, Row, Col, Input, Select } from "antd";
import { useGetAllTicketSystems } from "@api/manage";
import { removeVietnameseTones } from "services/utils/validates";

const FormSearchSubSystem = ({ setDataSearch }) => {
  const [form] = Form.useForm();
  const { refetch, data: dataSystem } = useGetAllTicketSystems(
    {
      page: 0,
      size: 1000,
    },
    { query: { enabled: false } }
  );
  const handleSearch = (values) => {
    values.searchSubSystem = values.searchSubSystem?.trim();
    values.status = values.status ? "true" : "false";
    setDataSearch({ ...values });
  };

  const resetForm = () => {
    form.resetFields();
    setDataSearch({ ...form.getFieldsValue() });
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item label="Tìm kiếm" name="searchSubSystem">
            <Input placeholder="Từ khóa" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusSubSystem">
            <Select allowClear placeholder="Trạng thái" style={{ width: 200 }}>
              <Select.Option key="true">Hoạt động</Select.Option>
              <Select.Option key="false">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="systems">
            <Select
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              mode="multiple"
              maxTagCount={1}
              style={{ width: 200 }}
              allowClear
              placeholder="Hệ thống"
            >
              {dataSystem?.content.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
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

export default FormSearchSubSystem;
