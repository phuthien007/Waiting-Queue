import { Form, Button, Row, Col, Input, Select } from "antd";

const FormSearchSystem = ({ setDataSearch }) => {
  const [form] = Form.useForm();
  const handleSearch = (values) => {
    values.searchSystem = values.searchSystem?.trim();
    values.status = values.status ? "true" : "false";
    setDataSearch({ ...values });
  };

  const resetForm = () => {
    form.resetFields();
    setDataSearch({ ...form.getFieldsValue() });
  };

  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item label="Tìm kiếm" name="searchSystem">
            <Input placeholder="Từ khóa" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusSystem">
            <Select allowClear placeholder="Trạng thái" style={{ width: 200 }}>
              <Select.Option key="true">Hoạt động</Select.Option>
              <Select.Option key="false">Ngừng hoạt động</Select.Option>
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

export default FormSearchSystem;
