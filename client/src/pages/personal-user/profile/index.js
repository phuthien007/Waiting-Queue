import { SaveOutlined, UserOutlined } from "@ant-design/icons";
// import { useUpdateProfile } from "@api/auth";
import { Button, Card, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentAccount, selectUser } from "store/userSlice";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

// const { Option } = Select

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 14,
  },
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const { isLoading, mutateAsync } = useUpdateProfile();
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName || "Họ và tên",
      username: user.username || "Tên đăng nhập",
      email: user.email || "Email",
      agent: user.agent || "Đơn vị",
      // disableEmailNotification: user.disableEmailNotification,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    // await mutateAsync({
    //   data: {
    //     fullName: values.fullName,
    //     disableEmailNotification: undefined,
    //   },
    // });
    // if (isLoading === false) {
    //   notification.success({
    //     message: "Thành công",
    //     description: "Cập nhật thông tin thành công!",
    //   });
    //   dispatch(loadCurrentAccount());
    // }
  };

  return (
    <>
      <Helmet title="Thông tin cá nhân" />
      <Card
        title={
          <>
            <UserOutlined className="mr-2" /> <strong>Thông tin cá nhân</strong>
          </>
        }
      >
        <Form
          {...layout}
          style={{ marginBottom: 0 }}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            name="fullName"
            label="Họ và tên:"
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            name="username"
            label="Tên đăng nhập:"
          >
            <Input bordered={false} readOnly />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }} name="email" label="Email:">
            <Input bordered={false} readOnly />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }} name="agent" label="Đơn vị:">
            <Input bordered={false} readOnly />
          </Form.Item>

          {/* <Form.Item
          name="disableEmailNotification"
          wrapperCol={{ span: 16, offset: 4 }}
          valuePropName="checked"
        >
          <Checkbox>Không nhận email thông báo từ hệ thống </Checkbox>
        </Form.Item> */}

          <Form.Item {...tailLayout}>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Profile;
