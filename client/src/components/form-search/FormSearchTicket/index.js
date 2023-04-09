/* eslint-disable react/jsx-indent */
import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Input, Select, AutoComplete } from "antd";
import {
  useGetAllTicketSubSystems,
  useGetAllTicketSystems,
  useGetAllUserListAccounts,
  useGetAllUserToSearch,
} from "@api/manage";
import { useSelector } from "react-redux";
import { removeVietnameseTones } from "services/utils/validates";
import { selectUser } from "store/userSlice";

const FormSearchTicket = ({ setDataSearch, dataSearch }) => {
  const { role } = useSelector(selectUser);
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [options, setOptions] = useState([]);
  const { refetch: getDataAccount, data: dataAccount } = useGetAllUserToSearch({
    text: valueSearch,
  });
  const onSearch = (searchText) => {
    setValueSearch(searchText);
  };
  const onSelect = (e, obj) => {
    setValue(obj.key);
  };
  const handleSearch = (values) => {
    values.searchTicket = values.searchTicket?.trim();
    if (valueSearch.length > 0) {
      values.userTicket = value ? [value] : undefined;
    } else {
      values.userTicket = undefined;
    }
    setDataSearch({ ...values });
  };
  const resetForm = () => {
    form.resetFields();
    setValue("");
    setValueSearch("");
    setDataSearch({ ...form.getFieldsValue() });
  };

  const { refetch: getSystem, data: dataSystem } = useGetAllTicketSystems({
    page: 0,
    size: 10000,
    "status.equals": 1,
  });
  const { refetch: getSubSystem, data: dataSubSystem } =
    useGetAllTicketSubSystems(
      {
        page: 0,
        size: 10000,
        "status.equals": 1,
      },
      {
        query: {
          enabled: false,
        },
      }
    );

  useEffect(() => {
    getSystem();
    getSubSystem();
  }, [getSubSystem, getSystem]);

  useEffect(() => {
    if (valueSearch.length === 0) {
      setOptions([]);
    }
    if (dataAccount && valueSearch.length > 0) {
      const data = dataAccount.map((item) => ({
        value: item.fullName,
        key: item.id,
      }));
      setOptions(data);
    }
  }, [dataAccount, valueSearch.length]);

  useEffect(() => {
    if (valueSearch.length > 0) {
      getDataAccount();
    }
  }, [valueSearch, getDataAccount]);

  return (
    <Form onFinish={handleSearch} form={form} layout="inline">
      <Row justify="start">
        <Col>
          <Form.Item name="searchTicket" label="Tìm kiếm">
            <Input allowClear placeholder="Theo tiêu đề" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="statusTicket">
            <Select allowClear placeholder="Trạng thái">
              <Select.Option key="0">Chờ xử lý</Select.Option>
              <Select.Option key="1">Đang xử lý</Select.Option>
              <Select.Option key="2">Đã xử lý</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="systemTicket">
            <Select
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              mode="multiple"
              maxTagCount={1}
              style={{ width: 150 }}
              allowClear
              placeholder="Hệ thống"
            >
              {dataSystem?.content?.length
                ? dataSystem.content.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name="subSystemTicket">
            <Select
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
              maxTagCount={1}
              style={{ width: 150 }}
              allowClear
              placeholder="Phân hệ con"
            >
              {dataSubSystem?.content?.length
                ? dataSubSystem.content.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
        </Col>
        {role.includes("ADMIN") && (
          <Col>
            <Form.Item name="agentTicket">
              <Select
                mode="multiple"
                showSearch
                filterOption={(input, option) =>
                  removeVietnameseTones(
                    option?.children?.toLowerCase()
                  )?.includes(removeVietnameseTones(input?.toLowerCase()))
                }
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
                        // eslint-disable-next-line react/jsx-indent
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))
                    : null}
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col>
          <Form.Item name="userTicket">
            <AutoComplete
              allowClear
              onClear={() => setValueSearch("")}
              options={options}
              style={{
                width: 200,
              }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="Tài khoản"
            />
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

export default FormSearchTicket;
