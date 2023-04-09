import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Tabs,
  Switch,
  Space,
  Modal,
  notification,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import UploadImageComponent from "components/administration/UploadImageComponent";
import {
  useEditEmailSettings,
  useEditSecuritySettings,
  useGetEmailSettings,
  useGetSecuritySettings,
  useGetSlideConfig,
  useSendEmailTest,
} from "@api/manage";
import { Helmet } from "react-helmet";
import { ValidateEmail } from "services/utils/validates";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 14,
  },
};
const Configuration = () => {
  const [formEmailConfig] = Form.useForm();
  const [formSecurities] = Form.useForm();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { refetch: getConfiguration, data: dataConfiguration } =
    useGetSecuritySettings({
      query: {
        enabled: false,
      },
    });

  const { isLoading: loadingUpdateSecurities, mutateAsync: updateSecurities } =
    useEditSecuritySettings();

  const { refetch: getEmailConfig, data: dataEmailConfig } =
    useGetEmailSettings({
      query: {
        enabled: false,
      },
    });

  const {
    isLoading: loadingUpdateEmailConfig,
    mutateAsync: updateEmailConfig,
  } = useEditEmailSettings();
  const { isLoading: loadingSendTestMail, mutateAsync: sendTestMail } =
    useSendEmailTest();

  const { refetch: getSlideConfig, data: dataSlideConfig } = useGetSlideConfig({
    query: {
      enabled: false,
    },
  });
  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const onFinish = values => {
  //   console.log(values)
  // }

  const onFinishTest = (values) => {
    sendTestMail({
      data: values,
    })
      .then(() => {
        notification.info({
          message: "Thông báo",
          description:
            "Email đã được gửi thành công, vui lòng kiểm tra hộp thư đến của bạn",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishUpdateSecurities = (values) => {
    updateSecurities({ data: values }).then(() => {
      notification.success({
        message: "Thành công",
        description: "Bạn đã cập nhật thành công",
      });
    });
  };
  const onFinishUpdateEmailConfig = (values) => {
    updateEmailConfig({ data: values }).then(() => {
      notification.success({
        message: "Thành công",
        description: "Bạn đã cập nhật thành công",
      });
    });
  };

  const onFinishFailedTest = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    getConfiguration();
    getEmailConfig();
    getSlideConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (dataConfiguration) {
      formSecurities.setFieldsValue(dataConfiguration);
    }

    if (dataConfiguration) {
      formEmailConfig.setFieldsValue(dataEmailConfig);
    }
    // if (dataEmailConfig) {
    //   formEmailConfig.setFieldsValue(dataConfiguration)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataConfiguration, dataEmailConfig]);

  return (
    <>
      <Helmet title="Quản lý cấu hình" />
      <Card
        title={
          <>
            <i className="fa fa-cogs mr-2" /> <strong>CẤU HÌNH</strong>
          </>
        }
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <>
                <i className="fa fa-cog mr-2" /> <span>Cấu hình slide</span>
              </>
            }
            key="1"
          >
            <UploadImageComponent
              getSlideConfig={getSlideConfig}
              data={dataSlideConfig}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <i className="fa fa-envelope-square mr-2" /> <span>Email</span>
              </>
            }
            key="2"
          >
            <Form
              {...layout}
              style={{ marginBottom: 0 }}
              form={formEmailConfig}
              name="control-hooks"
              onFinish={onFinishUpdateEmailConfig}
            >
              <Form.Item
                style={{ marginBottom: 0 }}
                name="host"
                label="Địa chỉ Server:"
                rules={[
                  {
                    required: true,
                    message: "Địa chỉ server không được bỏ trống",
                  },
                ]}
              >
                <Input placeholder="Địa chỉ Server" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 0 }}
                name="port"
                label="Cổng:"
                rules={[
                  {
                    required: true,
                    message: "Cổng không được bỏ trống",
                  },
                ]}
              >
                <Input placeholder="Cổng" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 0 }}
                name="username"
                label="Tên đăng nhập:"
                rules={[
                  {
                    required: true,
                    message: "Tên đăng nhập không được bỏ trống",
                  },
                ]}
              >
                <Input placeholder="Tên đăng nhập" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="password"
                label="Mật khẩu:"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được bỏ trống",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="sender"
                label="Email:"
                rules={[
                  {
                    required: true,
                    message: "Email không được bỏ trống",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || ValidateEmail(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Email không hợp lệ"));
                    },
                  }),
                ]}
              >
                <Input type="email" placeholder="Email" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="ssl"
                label="SSL:"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Space>
                  <Button
                    loading={loadingUpdateEmailConfig}
                    type="primary"
                    icon={<i className="fe fe-save mr-2" />}
                    htmlType="submit"
                  >
                    Lưu
                  </Button>
                  <Button
                    htmlType="button"
                    style={{ color: "blue" }}
                    icon={<i className="fe fe-check mr-2" />}
                    onClick={showModal}
                  >
                    Test Email
                  </Button>
                  <Modal
                    title="Test email"
                    open={isModalOpen}
                    onOk={handleOk}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <Form
                      name="testMail"
                      labelCol={{
                        span: 8,
                      }}
                      form={form}
                      wrapperCol={{
                        span: 16,
                      }}
                      initialValues={{
                        remember: true,
                      }}
                      onFinish={onFinishTest}
                      onFinishFailed={onFinishFailedTest}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Địa chỉ email nhận"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Địa chỉ email nhận không được bỏ trống",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        wrapperCol={{
                          offset: 10,
                          span: 14,
                        }}
                      >
                        <Button
                          icon={<i className="fe fe-send mr-2" />}
                          type="primary"
                          htmlType="submit"
                          loading={loadingSendTestMail}
                        >
                          Gửi
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
                </Space>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <>
                <i className="fa fa-shield mr-2" /> <span>Bảo mật</span>
              </>
            }
            key="3"
          >
            <Form
              name="basic"
              form={formSecurities}
              labelCol={{
                span: 9,
              }}
              wrapperCol={{
                span: 8,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishUpdateSecurities}
              onFinishFailed={onFinishFailedTest}
              autoComplete="off"
            >
              <Form.Item
                label="Yêu cầu đổi mật khẩu sau"
                name="changePasswordAfter"
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống",
                  },
                ]}
              >
                <Input type="number" min={0} suffix="ngày" />
              </Form.Item>
              <Form.Item
                label="Tự động đăng xuất sau"
                name="logoutAfter"
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống",
                  },
                ]}
              >
                <Input type="number" min={0} suffix="giờ" />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 12,
                  span: 12,
                }}
              >
                <Button
                  loading={loadingUpdateSecurities}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </>
  );
};

export default Configuration;
