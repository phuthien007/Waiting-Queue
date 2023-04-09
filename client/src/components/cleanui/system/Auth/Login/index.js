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

const initialAccount = {};

let myInterval;
const disableOTPSeconds = 30;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    navigate("/public/home");
    // const authenticatedData = await authenticateAsync({
    //   data: { ...values, rememberMe: true },
    // });
    // if (authenticatedData) {
    //   store.set("accessToken", authenticatedData.accessToken);
    //   dispatch(loadCurrentAccount());
    //   navigate(settingsConfig.getLoginRedirectUrl() || "/");
    // }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={`card ${style.container}`}>
      <img src="/resources/images/tf-logo.png" alt="Logo của bạn" />
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
          name="username"
          rules={[
            { required: true, message: "Tên đăng nhập không được bỏ trống" },
          ]}
        >
          <Input size="large" placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}
        >
          <Input size="large" type="password" placeholder="Mật khẩu" />
        </Form.Item>

        <Button
          type="primary"
          size="large"
          className="text-center w-100 mb-4"
          htmlType="submit"
          // loading={isAuthenticating}
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
    </div>
  );
};

export default Login;
