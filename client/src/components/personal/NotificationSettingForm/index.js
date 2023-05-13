/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@ant-design/icons";
import { useUpdateProfile } from "@api/auth";
import {
  useGetAllDocumentActiveReceiveNotif,
  useGetDocgroupsDepartment,
  useUpdateUserDocumentGroup,
} from "@api/manage";
import { useGetTelegramUrl } from "@api/notification";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Modal,
  Tree,
  notification,
  Row,
} from "antd";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCurrentAccount, selectUser } from "store/userSlice";

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const NotificationSettingForm = ({ type }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visiable, setVisiable] = useState(false);
  // const [clickedConnectTelegram, setClickedConnectTelegram] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // get url telegram
  const { refetch: getTeleUrl } = useGetTelegramUrl({
    query: {
      enabled: false,
    },
  });

  const {
    isLoading: loadingSave,
    mutateAsync: refetchUpdateNotifUse,
    isSuccess: isSuccessUpdateNotifUse,
  } = useUpdateProfile();
  const {
    isLoading: loadingSaveDocGroup,
    mutateAsync: refetchUpdateNotifDocGroup,
    isSuccess: isSuccessDocGroup,
  } = useUpdateUserDocumentGroup();

  const { refetch: refetchActiveNotif } = useGetAllDocumentActiveReceiveNotif({
    query: {
      enabled: false,
    },
  });
  const {
    refetch: refetchGetDocGroupDepartment,
    data: dataGetDocGroupDepartment,
  } = useGetDocgroupsDepartment(
    {
      its: true,
    },
    {
      query: {
        enabled: false,
      },
    }
  );

  const onExpand = (expandedKeysValue) => {
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };
  const tProps = {
    treeData: dataGetDocGroupDepartment || [],
    checkable: true,
    onExpand,
    expandedKeys,
    autoExpandParent,
    onCheck,
    checkedKeys,
    onSelect,
    selectedKeys,
    style: {
      width: "100%",
    },
  };

  const showModal = () => {
    form.resetFields();
    if (type === "2") {
      refetchGetDocGroupDepartment();
      refetchActiveNotif()
        .then((res) => {
          setCheckedKeys(
            res.data.map((item) => {
              return item.toString();
            })
          );
          form.setFieldsValue({
            ...form.getFieldsValue(),
            docGroup: res.data.map((item) => item.toString()),
          });
          // setSelectedKeys(res.data)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        notificationSetting: user?.receiveNotificationUsing,
      });
    }

    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFinish = (values) => {
    if (type === "1") {
      refetchUpdateNotifUse({
        data: {
          receiveNotificationUsing: values.notificationSetting,
        },
      });
    }
    if (type === "2") {
      refetchUpdateNotifDocGroup({
        data: checkedKeys
          // eslint-disable-next-line eqeqeq
          .filter((item) => item.includes(";") || parseInt(item, 10) == item)
          .map((item) => item.split(";"))
          .flat(),
      });
    }
  };

  useEffect(() => {
    if (isSuccessUpdateNotifUse || isSuccessDocGroup) {
      handleOk();
      dispatch(loadCurrentAccount());
      notification.success({
        message: "Thành công",
        description: "Cập nhật thành công",
      });
    }
  }, [isSuccessUpdateNotifUse, isSuccessDocGroup]);
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
        title={
          type === "1" ? "Tùy chọn thông báo" : "Nhận thông báo từ nhóm văn bản"
        }
        okText={
          <>
            <i className="fe fe-save mr-2" /> <span>Lưu</span>
          </>
        }
        footer={null}
        width="50%"
        cancelButtonProps={{ danger: true }}
        cancelText={
          <div>
            <i className="fe fe-slash mr-2" /> <span>Hủy</span>
          </div>
        }
        closeIcon={<CloseOutlined style={{ color: "red" }} />}
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ htmlType: "submit" }}
        onCancel={handleCancel}
      >
        <Form onFinish={handleFinish} form={form}>
          {type === "1" ? (
            <Form.Item name="notificationSetting">
              <Checkbox.Group
                key="notificationSetting"
                style={{ width: "100%" }}
              >
                <Checkbox key="EMAIL" value="EMAIL" style={{ width: "100%" }}>
                  Nhận thông báo qua email
                </Checkbox>
                <Divider />
                <Checkbox
                  key="TELEGRAM"
                  value="TELEGRAM"
                  onChange={(e) => setVisiable(e.target.checked)}
                  style={{ width: "100%" }}
                >
                  Nhận thông báo qua Telegram
                </Checkbox>
                <Badge.Ribbon
                  color="volcano"
                  style={{ display: visiable ? "block" : "none" }}
                  text="Chú ý"
                >
                  <Card
                    style={{
                      display: visiable ? "block" : "none",
                      marginTop: 10,
                    }}
                    title="Xác nhận thông báo"
                    size="small"
                  >
                    <ol>
                      <li>Bấm nút xác nhận</li>
                      <li>
                        Khi màn hình chuyển sang Telegram, bấm nút Start để hoàn
                        thành
                      </li>
                    </ol>
                    <Row justify="center">
                      <Button
                        icon={
                          <i
                            className="fa fa-telegram mr-2"
                            style={{ backgroundColor: "blue", color: "white" }}
                            aria-hidden="true"
                          />
                        }
                        style={{ backgroundColor: "blue", color: "white" }}
                        onClick={() => {
                          getTeleUrl()
                            .then((res) => {
                              // setClickedConnectTelegram(true)
                              window.open(res.data, "_blank");
                            })
                            .catch((err) => {
                              notification.error({
                                message: "Lỗi",
                                description:
                                  "Có lỗi xảy ra trong quá trình tạo link",
                              });
                            });
                        }}
                      >
                        Xác nhận thông báo Telegram
                      </Button>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </Checkbox.Group>
            </Form.Item>
          ) : (
            <Form.Item name="docGroup" valuePropName="checked">
              {dataGetDocGroupDepartment ? (
                <Tree {...tProps} />
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </Form.Item>
          )}
          <Form.Item {...tailLayout}>
            <Row>
              <Col span={4}>
                <Button
                  icon={<i className="fe fe-x mr-2" />}
                  onClick={handleCancel}
                  type="danger"
                >
                  Hủy
                </Button>
              </Col>
              <Col offset={4} span={16}>
                <Button
                  loading={loadingSave || loadingSaveDocGroup}
                  icon={<i className="fe fe-save mr-2" />}
                  type="primary"
                  htmlType="submit"
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationSettingForm;
