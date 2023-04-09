import { Form, Button, Row, Col, Input } from "antd";

const FormSearchListEmail = ({ setDataSearch }) => {
  const [form] = Form.useForm();
  const handleSearch = (values) => {
    values.searchDocType = values.searchDocType?.trim();
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
          <Form.Item label="Tìm kiếm" name="searchDocType">
            <Input placeholder="Từ khóa" allowClear />
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

export default FormSearchListEmail;
