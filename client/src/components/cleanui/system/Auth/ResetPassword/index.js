import { Input, Button, Form, notification } from "antd";
// import { useCompletePasswordReset } from "@api/auth";
import { history } from "index";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import store from "store";
import { ValidatePassword } from "services/utils/validates";
import style from "../style.module.scss";
import { useAuthControllerFinishResetPassword } from "@api/waitingQueue";
import React from "react";

const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, mutateAsync } = useAuthControllerFinishResetPassword();
  const { token } = useParams();

  const onFinish = async (values) => {
    const { newPassword, againNewPassword } = values;

    mutateAsync({
      token,
      data: {
        newPassword: newPassword,
        replyPassword: againNewPassword,
      },
    })
      .then(() => {
        if (!isLoading) {
          notification.success({
            message: "Thành công",
            description: "Đổi mật khẩu mới thành công",
          });
          history.push("/auth/login");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  React.useEffect(() => {
    if (!token) {
      history.push("/auth/login");
    }
  }, [token]);

  return (
    <div>
      <div className={`card ${style.container}`}>
        <img src="/resources/images/tf-logo.jpg" alt="Logo của bạn" />

        <div className="text-dark font-size-24 mb-4 text-center  mt-5">
          <strong>Đặt lại mật khẩu</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Mật khẩu mới không được bỏ trống",
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
            hasFeedback
          >
            <Input.Password size="large" placeholder="Mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name="againNewPassword"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Xác nhận mật khẩu mới không được bỏ trống",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Mật khẩu không trùng khớp"));
                },
              }),
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
            <Input.Password size="large" placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          {/* <Form.Item
            name="recaptcha"
            rules={[
              { required: true, message: "Vui lòng hoàn thành mã captcha" },
            ]}
          >
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_KEYCAPTCHA}
              onChange={handleRecaptcha}
            />
          </Form.Item> */}
          <Button
            type="primary"
            loading={isLoading}
            htmlType="submit"
            size="large"
            className="text-center w-100"
          >
            <strong>Lưu thay đổi</strong>
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
