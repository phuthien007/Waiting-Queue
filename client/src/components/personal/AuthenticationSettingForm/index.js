import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useAuthControllerChangePassword } from "@api/waitingQueue";
// import { useChangePassword } from "@api/auth";
import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ValidatePassword } from "services/utils/validates";
import { logoutUser, selectUser } from "store/userSlice";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

// const { Option } = Select

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 12,
  },
};

const AuthenticationSettingForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, mutateAsync } = useAuthControllerChangePassword();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    mutateAsync({
      data: {
        oldPassword: values.oldPw,
        newPassword: values.newPw,
        confirmPassword: values.reNewPw,
      },
    })
      .then(() => {
        if (!isLoading) {
          notification.success({
            message: "Thành công",
            description: "Đổi mật khẩu thành công",
          });
        }
        setTimeout(() => {
          // dispatch({
          //   type: "user/SET_STATE",
          //   payload: {
          //     loading: true,
          //   },
          // });
          dispatch(logoutUser());
        }, 1000);
        setIsModalOpen(false);
        // dispatch({
        //   type: "user/SET_STATE",
        //   payload: {
        //     loading: false,
        //   },
        // });
      })
      .catch((err) => console.log(err));
  };

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

  return (
    <div>
      <Button
        onClick={showModal}
        shape="round"
        type="primary"
        icon={<i className="fa fa-pencil mr-2" />}
      >
        Thay đổi
      </Button>

      <Modal
        title="Thay đổi mật khẩu"
        okText={
          <>
            <i className="fe fe-save mr-2" /> <span>Lưu</span>
          </>
        }
        width="50%"
        cancelButtonProps={{ danger: true }}
        cancelText={
          <div>
            <i className="fe fe-slash mr-2" /> <span>Hủy</span>
          </div>
        }
        footer={null}
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
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
              type="danger"
              icon={<i className="fe fe-slash mr-2" />}
              htmlType="button"
              onClick={handleCancel}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              loading={isLoading}
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthenticationSettingForm;
