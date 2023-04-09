/* eslint-disable react/jsx-indent */
import { Form, Button, Row, Col, Input, Select } from "antd";
import { removeVietnameseTones } from "services/utils/validates";

const FormSearchAccount = ({ setDataSearch, dataSearch, type }) => {
  const [form] = Form.useForm();
  const handleSearch = (values) => {
    values.searchAccount = values.searchAccount?.trim();
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
          <Form.Item className="mb-2" label="Tìm kiếm" name="searchAccount">
            <Input placeholder="Tìm theo tên, tên đăng nhập hoặc email" />
          </Form.Item>
        </Col>
        {(!type || type !== "publish") && (
          <Col>
            <Form.Item className="mb-2" name="statusAccount">
              <Select
                allowClear
                placeholder="Trạng thái"
                style={{ width: 200 }}
              >
                <Select.Option key={1}>Hoạt động</Select.Option>
                <Select.Option key={0}>Ngừng hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        )}
        <Col>
          <Form.Item className="mb-2" name="agentAccount">
            <Select
              mode="multiple"
              maxTagCount={2}
              allowClear
              placeholder="Đơn vị"
              style={{ width: 250 }}
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
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

export default FormSearchAccount;
