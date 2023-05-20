/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircleFilled, SendOutlined } from "@ant-design/icons";
import {
  Input,
  Button,
  Form,
  Modal,
  Radio,
  Checkbox,
  Space,
  Divider,
  Row,
  Col,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import store from "store";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useAuthenticate, useAuthenticateOTP, useSendOTP } from "@api/auth";
import settingsConfig from "configs/settingsConfig";
import { loadCurrentAccount } from "store/userSlice";
import style from "../style.module.scss";
import { ValidateEmail } from "services/utils/validates";
import { useAuthControllerLogin } from "@api/waitingQueue";

const initialAccount = {
  email: "xephang@super.admin.com",
  password: "123456Aa@",
  tenantCode: "qeGFUgg2Pw",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading: isAuthenticating, mutateAsync } = useAuthControllerLogin();

  const onFinish = async (values) => {
    // navigate("/public/home");
    const authenticatedData = await mutateAsync({
      data: {
        email: values.email,
        password: values.password,
        tenantCode: values.tenantCode,
      },
    });
    if (authenticatedData) {
      dispatch(loadCurrentAccount());
      navigate(settingsConfig.getLoginRedirectUrl() || "/");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={`card ${style.container}`}>
      <img
        src="/resources/images/tf-logo.svg"
        style={{ height: 240 }}
        alt="Logo của bạn"
      />
      <div
        className="text-dark font-size-24 mb-3 mt-5"
        style={{ textAlign: "center" }}
      >
        <strong>Đăng nhập hệ thống</strong>
      </div>

      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-4"
        initialValues={
          process.env.NODE_ENV === "development" ? initialAccount : {}
        }
      >
        <Form.Item
          name="email"
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
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}
        >
          <Input.Password size="large" type="password" placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item
          name="tenantCode"
          rules={[
            { required: true, message: "Mã công ty không được bỏ trống" },
          ]}
        >
          <Input size="large" type="text" placeholder="Mã công ty" />
        </Form.Item>

        <Button
          type="primary"
          size="large"
          className="text-center w-100 mb-4"
          htmlType="submit"
          loading={isAuthenticating}
        >
          <strong>Đăng nhập</strong>
        </Button>
        <Link
          to="/auth/forgot-password"
          className="kit__utils__link font-size-16"
        >
          Quên mật khẩu?
        </Link>
      </Form>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Bạn muốn trở thành đối tác của chúng tôi?</span>
        <Link to="/auth/register" className="kit__utils__link font-size-16">
          Đăng ký
        </Link>
      </div>
    </div>
  );
};

export default Login;
