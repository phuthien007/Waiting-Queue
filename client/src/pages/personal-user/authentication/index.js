/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
// import { useBindLDAP, useRemoveADAccount, useUpdateProfile } from "@api/auth";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  List,
  Modal,
  notification,
} from "antd";
import AuthenticationSettingForm from "components/personal/AuthenticationSettingForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentAccount, selectUser } from "store/userSlice";

const Authentication = () => {
  const user = useSelector(selectUser);
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({
      twoFactorAuthUsing:
        user.twoFactorAuthUsing && user.twoFactorAuthUsing.length !== 0
          ? user.twoFactorAuthUsing
          : ["EMAIL"],
    });
  }, [form, user, dispatch]);

  // useEffect(() => {
  //   formAD.setFieldsValue({
  //     password: "",
  //     username: user.adAccount,
  //   });
  // }, []);

  return (
    <Card
      title={
        <>
          <i className="fa fa-lock mr-2" />
          <strong>Bảo mật</strong>
        </>
      }
    >
      <List itemLayout="horizontal">
        <List.Item
          className="align-items-start"
          actions={[<AuthenticationSettingForm />]}
        >
          <List.Item.Meta
            title={<b style={{ fontSize: "1.05rem" }}>Đổi mật khẩu</b>}
            description={<p>Thay đổi mật khẩu</p>}
          />
        </List.Item>
      </List>
    </Card>
  );
};

export default Authentication;
