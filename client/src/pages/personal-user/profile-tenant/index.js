import { SaveOutlined, UserOutlined } from "@ant-design/icons";
import { useTenantsControllerUpdateMyTenant } from "@api/waitingQueue";
// import { useUpdateProfile } from "@api/auth";
import { Button, Card, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentAccount, selectUser } from "store/userSlice";
import React from "react";

const layout = {
  labelCol: {
    span: 6,
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

const ProfileTenant = () => {
  const dispatch = useDispatch();
  const { tenant, isOwnerTenant, userLoading } = useSelector(selectUser);
  const { isLoading, mutateAsync } = useTenantsControllerUpdateMyTenant();
  const [renderOptionInput, setRenderOptionInput] = React.useState();

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      contactEmail: tenant?.contactEmail || "Email",
      address: tenant?.address || "Địa chỉ",
      contactPhone: tenant?.contactPhone || "Số điện thoại",
      description: tenant?.description || "Mô tả",
      name: tenant?.name || "Tên công ty",
      website: tenant?.website || "Website",
      note: tenant?.note || "Ghi chú",
    });
    if (isOwnerTenant) {
      setRenderOptionInput({ readOnly: false, bordered: true });
    } else {
      setRenderOptionInput({ readOnly: true, bordered: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    await mutateAsync({
      data: {
        ...tenant,
        ...values,
      },
    });
    if (isLoading === false) {
      notification.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công!",
      });
      dispatch(loadCurrentAccount());
    }
  };

  return (
    <>
      <Helmet title="Thông tin công ty" />
      <Card
        loading={userLoading}
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
          labelWrap
          onFinish={onFinish}
        >
          <Form.Item name="contactEmail" label="Email">
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên công ty"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên công ty",
              },
            ]}
          >
            <Input {...renderOptionInput} placeholder="Tên công ty" />
          </Form.Item>

          <Form.Item name="contactPhone" label="Số điện thoại">
            <Input {...renderOptionInput} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input {...renderOptionInput} placeholder="Địa chỉ" />
          </Form.Item>

          <Form.Item name="website" label="Website">
            <Input {...renderOptionInput} placeholder="Website" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input {...renderOptionInput} placeholder="Mô tả" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea {...renderOptionInput} placeholder="Ghi chú" />
          </Form.Item>

          {isOwnerTenant && (
            <Form.Item {...tailLayout}>
              <Button
                loading={isLoading}
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
              >
                Lưu
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </>
  );
};

export default ProfileTenant;
