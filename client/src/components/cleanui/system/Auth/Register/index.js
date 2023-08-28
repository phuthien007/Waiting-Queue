import { connect, useDispatch, useSelector } from "react-redux";
import { Input, Button, Form, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { selectUser } from "store/userSlice";
import style from "../style.module.scss";
import { ValidateEmail } from "services/utils/validates";
import { useTenantsControllerRegisterTenant } from "@api/waitingQueue";
import { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tokenCaptcha, setTokenCaptcha] = React.useState(null);
  const recaptchaRef = React.createRef();
  const { isLoading, mutateAsync: registerTenant } =
    useTenantsControllerRegisterTenant();

  const user = useSelector(selectUser);
  const onFinish = (values) => {
    // recaptchaRef.current.reset();
    registerTenant({
      data: {
        ...values,
        token: tokenCaptcha,
      },
    })
      .then((res) => {
        if (res) {
          notification.success({
            message: "Thành công",
            description:
              "Chúc mừng bạn đã đăng ký thành công. vui lòng kiểm tra email của bạn",
          });
          form.resetFields();
          navigate("/auth/login");
        }
      })
      .finally(() => {
        setTokenCaptcha(null);
        // reset recaptcha
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleRecaptcha = (value) => {
    setTokenCaptcha(value);
  };
  useEffect(() => {
    form.resetFields();
  }, []);

  return (
    <div className="mt-2">
      <div className={`card ${style.container}`}>
        <img
          onClick={() => {
            location.href = "/";
          }}
          src="/resources/images/tf-logo.svg"
          style={{ height: 240 }}
          alt="Logo của bạn"
        />

        <div className="text-dark font-size-24 mb-4">
          <strong>Đăng ký thông tin công ty</strong>
        </div>
        <div className="mb-4">
          <p>
            Để đăng ký sử dụng hệ thống, vui lòng điền đầy đủ thông tin bên
            dưới.
          </p>
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Tên công ty không được bỏ trống" },
            ]}
          >
            <Input size="large" placeholder="Tên công ty" />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Địa chỉ không được bỏ trống" }]}
          >
            <Input size="large" placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item
            name="contactEmail"
            rules={[
              { required: true, message: "Email không được bỏ trống" },
              {
                validator: (rule, value) => {
                  if (value && !ValidateEmail(value)) {
                    return Promise.reject("Email không hợp lệ");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            rules={[
              { required: true, message: "Số điện thoại không được bỏ trống" },
            ]}
          >
            <Input size="large" placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Mô tả không được bỏ trống" }]}
          >
            <Input placeholder="Mô tả" />
          </Form.Item>

          <Form.Item
            name="website"
            rules={[{ required: true, message: "Website không được bỏ trống" }]}
          >
            <Input size="large" placeholder="Website" />
          </Form.Item>
          <Form.Item name="note" rules={[]}>
            <Input.TextArea rows={4} placeholder="Ghi chú" />
          </Form.Item>
          {/* <Form.Item
            name="recaptcha"
            rules={[
              { required: true, message: "Vui lòng hoàn thành mã captcha" },
            ]}
          >
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_KEYCAPTCHA}
              onChange={handleRecaptcha}
            />
          </Form.Item> */}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="text-center w-100"
            loading={isLoading}
          >
            <strong>Đăng ký</strong>
          </Button>
        </Form>
        <div>
          <span className="mr-1">Khi đăng ký, bạn đã đồng ý với</span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="kit__utils__link"
          >
            điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="kit__utils__link"
          >
            chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </div>
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Bạn đã có tài khoản?</span>
          Đăng nhập{" "}
          <Link to="/auth/login" className="kit__utils__link font-size-16">
            tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
