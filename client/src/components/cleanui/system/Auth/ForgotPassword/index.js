import { Input, Button, Form, notification } from "antd";
import { Link } from "react-router-dom";
// import { useRequestPasswordReset } from "@api/auth";
import style from "../style.module.scss";

const ForgotPassword = () => {
  // const { isLoading, mutateAsync } = useRequestPasswordReset();

  const onFinish = (values) => {
    // mutateAsync({
    //   data: values.email,
    // })
    //   .then(() => {
    //     notification.success({
    //       message: "Thành công",
    //       description:
    //         "Gửi yêu cầu thành công, vui lòng kiểm tra email để lấy lại mật khẩu",
    //     });
    //   })
    //   .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className={`card ${style.container}`}>
        <img src="/resources/images/tf-logo.png" alt="Logo của bạn" />

        <div
          className="text-dark font-size-24 mb-4 mt-5"
          style={{ textAlign: "center" }}
        >
          <strong>Quên mật khẩu</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
          // disabled={isLoading}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền địa chỉ email" },
              { type: "email", message: "Địa chỉ email không hợp lệ" },
            ]}
          >
            <Input size="large" placeholder="Địa chỉ email" />
          </Form.Item>
          <Button
            // loading={isLoading}
            type="primary"
            htmlType="submit"
            size="large"
            className="text-center w-100"
          >
            <strong>Lấy lại mật khẩu</strong>
          </Button>
        </Form>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          <i className="fe fe-arrow-left mr-1 align-middle" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
