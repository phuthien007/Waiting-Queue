import { QrcodeOutlined } from "@ant-design/icons";
import {
  useQueuesControllerAssignMember,
  useQueuesControllerGetAllUserOperateQueue,
  useUsersControllerFindAllUser,
} from "@api/waitingQueue";
import { UserDto } from "@api/waitingQueue.schemas";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
  notification,
} from "antd";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "store/userSlice";

type Props = {
  id: number;
  setDataUserInQueue: React.Dispatch<React.SetStateAction<UserDto[]>>;
};

const UserOperateQueue: React.FC<Props> = ({ id, setDataUserInQueue }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { role } = useSelector(selectUser);
  const [data, setData] = React.useState<UserDto[]>([]);

  const {
    isLoading: loadingUserInQueue,
    data: dataUserInQueue,
    refetch: getAllUserInQueue,
  } = useQueuesControllerGetAllUserOperateQueue(id, {
    query: {
      enabled: false,
    },
  });
  const {
    isLoading: loadingGetAllUser,
    data: dataUser,
    refetch: getAllUser,
  } = useUsersControllerFindAllUser({
    eq: [`role:OPERATOR`],
  });

  const { isLoading: loadingAssignMember, mutateAsync: assignMember } =
    useQueuesControllerAssignMember();

  const showModal = () => {
    if (role === "ADMIN") {
      getAllUser();
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    assignMember({
      id: id,
      data: data?.map((user: UserDto) => user.id),
    }).then(() => {
      setIsModalOpen(false);
      notification.success({
        message: "Thành công",
        description: "Bạn đã thêm người điều hành thành công",
      });
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    setData(dataUserInQueue);
    setDataUserInQueue(dataUserInQueue);
  }, [dataUserInQueue?.length]);

  React.useEffect(() => {
    getAllUserInQueue();
  }, [id]);

  return (
    <>
      {!data ||
        (data?.length === 0 && (
          <Col span={24}>
            <p>Chưa có người điều hành</p>
          </Col>
        ))}
      {data && data?.length > 0 && (
        <>{data.map((item) => item.fullName).join("; ")}</>
      )}
      <Button onClick={showModal}>Xem danh sách</Button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          role === "ADMIN" && [
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loadingAssignMember}
              onClick={handleOk}
            >
              Lưu
            </Button>,
          ]
        }
        confirmLoading={loadingAssignMember}
        title="Danh sách người điều hành"
      >
        {/* Render exist user operate this queue by list tag */}
        <Row>
          {!data ||
            (data?.length === 0 && (
              <Col span={24}>
                <p>Chưa có người điều hành</p>
              </Col>
            ))}
          {data?.map((user: UserDto) => {
            return (
              <Tag
                key={user.id}
                color="blue"
                className="px-2"
                closable
                onClose={() => {
                  setData(data?.filter((item) => item.id !== user.id));
                }}
                closeIcon={
                  <Tooltip title="Loại bỏ">
                    <i
                      className="fe fe-x"
                      style={{ color: "red", fontSize: 14 }}
                    />
                  </Tooltip>
                }
              >
                {user.fullName}
              </Tag>
            );
          })}
        </Row>
        {/* Render select button to admin can choose new user operate this queue */}
        {role === "ADMIN" && (
          <>
            <Divider />

            <Row>
              <Col span={24}>
                <Descriptions title="Chọn người điều hành mới">
                  <Descriptions.Item label="Người điều hành">
                    <Select
                      loading={loadingGetAllUser}
                      maxTagCount={3}
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Chọn người điều hành"
                      value={data?.map((user: UserDto) => user.id)}
                      clearIcon={<i className="fe fe-x" />}
                      filterOption={(input, option) => {
                        const user = _.toString(option?.children);
                        return (
                          user?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      onChange={(value: number[]) => {
                        setData(
                          dataUser?.data?.filter((user: UserDto) =>
                            value.includes(user.id)
                          )
                        );
                      }}
                    >
                      {dataUser?.data?.map((user: UserDto) => {
                        return (
                          <Select.Option key={user.id} value={user.id}>
                            {user.fullName}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserOperateQueue;
