/* eslint-disable jsx-a11y/anchor-is-valid */
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Avatar, Space } from "antd";
import { Link } from "react-router-dom";
import { logoutUser, selectUser } from "store/userSlice";
import styles from "./style.module.scss";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const logout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  const menu = (
    <Menu selectable={false}>
      <Menu.Item key="profile">
        <Link to="/personal-user/profile">
          <UserOutlined className="mr-2" />
          Thông tin cá nhân
        </Link>
      </Menu.Item>
      <Menu.Item key="profile-tenant">
        <Link to="/personal-user/profile-tenant">
          <i className="fa fa-laptop mr-2" />
          Thông tin công ty
        </Link>
      </Menu.Item>
      <Menu.Item key="authentication">
        <Link to="/personal-user/authentication">
          <i className="fa fa-lock mr-2" />
          Bảo mật
        </Link>
      </Menu.Item>
      <Menu.Divider key="divider" />
      <Menu.Item key="logout">
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <div className={styles.dropdown}>
        <Space>
          <Avatar
            className={styles.avatar}
            shape="circle"
            size="default"
            icon={<UserOutlined />}
          />
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {user.fullName || "Annonymous"}
          </span>
        </Space>
      </div>
    </Dropdown>
  );
};

export default ProfileMenu;
