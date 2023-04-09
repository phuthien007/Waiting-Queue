/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-indent */
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useGetDocgroupsDepartment } from "@api/manage";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tooltip,
  TreeSelect,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import {
  removeVietnameseTones,
  ValidatePassword,
  ValidateUserName,
} from "services/utils/validates";
// import ValidateUserName from '../../../services/utils/validates'

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const { SHOW_PARENT } = TreeSelect;

const AccountForm = ({
  type,
  data,
  saveData,
  loadingSave,
  isSuccess,
  dataAgents,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [visiableDocGroup, setVisiableDocGroup] = useState(false);
  // const [docGroups, setDocGroups] = useState(['0-0-0'])

  // const onChange = newValue => {
  //   console.log('onChange ', newValue)
  //   setDocGroups(newValue)
  // }

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
  const tProps = {
    treeData: dataGetDocGroupDepartment || [],
    // docGroups,
    // onChange,
    maxTagCount: 2,
    treeCheckable: true,
    allowClear: true,
    filterTreeNode: (inputValue, treeNode) => {
      return (
        removeVietnameseTones(treeNode.title.toLowerCase()).indexOf(
          removeVietnameseTones(inputValue.toLowerCase())
        ) >= 0
      );
    },
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Nhóm văn bản",
  };
  const showModal = () => {
    // group all object with same deparment
    // const dataAgentsGroup = dataAgents.reduce((r, a) => {
    //   r[a.department] = [...(r[a.department] || []), a]
    //   return r
    // }, {})
    form.resetFields();
    form.setFieldsValue({
      ...data,
      status: data?.status.toString() || undefined,
      agent: data?.agents ? data.agents.id : undefined,
      groups: data?.groups
        ? data.groups.map((item) => item.id.toString())
        : undefined,
      roles: data?.roles ? data.roles.map((item) => item.name) : undefined,
      twoFactorAuth: data.twoFactorAuth ? data.twoFactorAuth : false,
    });
    if (
      data?.roles &&
      (data?.roles?.map((item) => item.name).includes("A1") ||
        data?.roles?.map((item) => item.name).includes("USER"))
    ) {
      setVisiableDocGroup(true);
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    values.id = data.id;
    values.twoFactorAuth = values.twoFactorAuth ? 1 : 0;
    // setup docgroup if user is A1 or USER
    if (
      values.roles &&
      (values.roles.includes("A1") || values.roles.includes("USER"))
    ) {
      values.groups =
        values.groups?.map((item) => item.split(";")).flat() || [];
    } else {
      values.groups = [];
    }
    saveData(type, values);
    // values.id = data.id
    // saveData({ ...values })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (isSuccess) {
      handleOk();
    }
  }, [isSuccess]);

  useEffect(() => {
    refetchGetDocGroupDepartment();
  }, []);

  return (
    <>
      {type === "add" ? (
        <Button
          onClick={showModal}
          style={{ backgroundColor: "#1a9c02", color: "white" }}
        >
          <Space>
            <i className="fe fe-plus" />
            Thêm mới
          </Space>
        </Button>
      ) : (
        <Tooltip title="Sửa">
          <Button
            onClick={showModal}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
          />
        </Tooltip>
      )}
      <Modal
        title={type === "add" ? "Thêm mới" : "Chỉnh sửa"}
        okText="Lưu"
        width="50%"
        cancelText="Hủy"
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            label="Họ tên:"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Họ tên không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Họ tên chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Họ tên" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Tên đăng nhập:"
            name="userName"
            rules={[
              {
                required: true,
                message: "Tên đăng nhập không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || ValidateUserName(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Tên đăng nhập chỉ chứa kí tự 0-9, A-Z và một số ký tự khác"
                        )
                      ),
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Tên đăng nhập chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="text" placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Mật khẩu:"
            name="password"
            rules={[
              type === "add"
                ? {
                    required: true,
                    message: "Mật khẩu không được bỏ trống",
                  }
                : null,
              {
                validator: (_, value) =>
                  !value || ValidatePassword(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm ít nhất 01 kí tự chữ thường, 01 kí tự chữ in hoa, 01 kí tự đặc biệt, 01 kí tự số và không chứa kí tự khoảng trống"
                        )
                      ),
              },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Email:"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được bỏ trống",
              },
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 256)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Email chỉ chứa tối đa 256 kí tự")
                      ),
              },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Đơn vị:"
            name="agent"
            rules={[
              {
                required: true,
                message: "Đơn vị không được bỏ trống",
              },
            ]}
          >
            <Select
              placeholder="Đơn vị"
              showSearch
              filterOption={(input, option) =>
                removeVietnameseTones(
                  option?.children?.toLowerCase()
                )?.includes(removeVietnameseTones(input?.toLowerCase()))
              }
            >
              <Select.OptGroup key="A1" label="A1">
                {dataAgents?.searchAgentA1.length
                  ? dataAgents.searchAgentA1.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>

              <Select.OptGroup key="User" label="Đơn vị">
                {dataAgents?.searchAgentUser.length
                  ? dataAgents.searchAgentUser.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  : null}
              </Select.OptGroup>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Quyền:"
            name="roles"
            rules={[
              {
                required: true,
                message: "Quyền hạn không được để trống",
              },
            ]}
          >
            <Checkbox.Group
              onChange={(e) => {
                if (e && (e.includes("A1") || e.includes("USER"))) {
                  setVisiableDocGroup(true);
                } else {
                  setVisiableDocGroup(false);
                }
              }}
            >
              <Checkbox key="ADMIN" value="ADMIN">
                ADMIN
              </Checkbox>
              <br />
              <Checkbox key="A1" value="A1">
                A1
              </Checkbox>
              <br />
              <Checkbox key="USER" value="USER">
                USER
              </Checkbox>
              <br />
              <Checkbox key="DOC_KEEPER" value="DOC_KEEPER">
                DOC_KEEPER
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            // set role is array
            hidden={!visiableDocGroup}
            label="Nhóm văn bản:"
            name="groups"
            rules={[
              {
                required: visiableDocGroup,
                message: "Nhóm văn bản không được để trống",
              },
            ]}
          >
            <TreeSelect {...tProps} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label="Trạng thái:"
            name="status"
            rules={[
              {
                required: true,
                message: "Trạng thái không được để trống",
              },
            ]}
          >
            <Select placeholder="Trạng thái">
              <Select.Option key="1">Hoạt động</Select.Option>
              <Select.Option key="0">Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Xác thực hai lớp:"
            name="twoFactorAuth"
            help="*Mặc định mã xác thực sẽ gửi qua email"
            valuePropName="checked"
          >
            <Switch
              style={{ color: "green" }}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                validator: (_, value) =>
                  !value || (value.length >= 0 && value.length <= 500)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mô tả chỉ chứa tối đa 500 kí tự")
                      ),
              },
            ]}
          >
            <TextArea placeholder="Mô tả" rows={3} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Row>
              <Col span={4}>
                <Button
                  icon={<i className="fe fe-x mr-2" />}
                  onClick={handleCancel}
                  type="danger"
                >
                  Hủy
                </Button>
              </Col>
              <Col offset={4} span={16}>
                <Button
                  loading={loadingSave}
                  icon={<i className="fe fe-save mr-2" />}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountForm;
