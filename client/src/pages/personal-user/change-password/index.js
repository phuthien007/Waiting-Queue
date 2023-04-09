import { SaveOutlined } from "@ant-design/icons";
// import { useChangePassword } from "@api/auth";
import { Alert, Button, Card, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ValidatePassword } from "services/utils/validates";
import { Helmet } from "react-helmet";
import { logoutUser, selectUser } from "store/userSlice";

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

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [form] = Form.useForm();
  // const { isLoading, mutateAsync } = useChangePassword();
  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName || "Họ và tên",
      username: user.username || "Tên đăng nhập",
      email: user.email || "Email",
      department: user.department || "Đơn vị",
      receiveMail: user.receiveMail || true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values) => {
    // mutateAsync({
    //   data: {
    //     currentPassword: values.oldPw,
    //     newPassword: values.newPw,
    //   },
    // })
    //   .then(() => {
    //     if (!isLoading) {
    //       notification.success({
    //         message: "Thành công",
    //         description: "Đổi mật khẩu thành công",
    //       });
    //     }
    //     setTimeout(() => {
    //       dispatch(logoutUser());
    //     }, 1000);
    //   })
    //   .catch((err) => console.log(err));
  };

  return (
    <>
      <Helmet title="Thông tin cá nhân" />
      <Card title="Thông tin cá nhân" headStyle={{ fontWeight: "bold" }}>
        {user && user.isRequireChangePassword ? (
          <Alert
            message="Bạn phải đổi mật khẩu để tiếp tục sử dụng hệ thống"
            type="info"
            showIcon
          />
        ) : null}
        <Form
          {...layout}
          className="mt-3"
          style={{ marginBottom: 0 }}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item
            name="oldPw"
            label="Mật khẩu hiện tại:"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
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
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPw"
            label="Mật khẩu mới:"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPw") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Mật khẩu mới không được trùng với mật khẩu hiện tại"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="reNewPw"
            label="Nhập lại khẩu mới:"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPw") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button
              // loading={isLoading}
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
