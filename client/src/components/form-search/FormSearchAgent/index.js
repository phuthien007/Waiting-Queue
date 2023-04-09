import { Form, Button, Row, Col, Input, Select } from "antd";

const FormSearchAgent = ({ setDataSearch }) => {
  const [form] = Form.useForm();
  const handleSearch = (values) => {
    values.searchAgent = values.searchAgent?.trim();
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
          <Form.Item label="Tìm kiếm" name="searchAgent">
            <Input placeholder="Từ khóa" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusAgent">
            <Select allowClear placeholder="Trạng thái" style={{ width: 200 }}>
              <Select.Option key={1}>Hoạt động</Select.Option>
              <Select.Option key={0}>Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="typeAgent">
            <Select allowClear placeholder="Loại đơn vị" style={{ width: 150 }}>
              <Select.Option key="1">A1</Select.Option>
              <Select.Option key="2">Đơn vị</Select.Option>
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

export default FormSearchAgent;
