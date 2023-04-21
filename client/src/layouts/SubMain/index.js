import { useEffect, useState } from "react";
import { Avatar, Card, Col, Layout, Menu, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Breadcrumbs from "components/cleanui/layout/Breadcrumbs";
import Footer from "components/cleanui/layout/Footer";
import MenuMain from "components/cleanui/layout/Menu";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { selectSettings } from "store/settingSlice";
import { logoutUser, selectUser } from "store/userSlice";
import IdleTimer from "components/system/IdleTimer";

const SubMainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isContentMaxWidth,
    isAppMaxWidth,
    isGrayBackground,
    isSquaredBorders,
    isCardShadow,
    isBorderless,
  } = useSelector(selectSettings);

  const user = useSelector(selectUser);
  const location = useLocation();

  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    setSelectedMenu(getDefaultActiveKey(location.pathname));
  }, [location]);

  function getItem(label, key, icon) {
    return {
      label,
      key,
      icon,
    };
  }

  const logout = () => {
    // e.preventDefault()
    dispatch(logoutUser());
  };

  const getDefaultActiveKey = (path) => {
    if (path.endsWith("/personal-user/profile")) {
      return ["profile"];
    }
    if (path.endsWith("/personal-user/profile-tenant")) {
      return ["profile-tenant"];
    }

    if (path.endsWith("/personal-user/authentication")) {
      return ["authentication"];
    }

    return [];
  };

  const items = [
    getItem(
      <Link to="/personal-user/profile">Thông tin cá nhân</Link>,
      "profile",
      <UserOutlined />
    ),
    getItem(
      <Link to="/personal-user/profile-tenant">Thông tin công ty</Link>,
      "profile-tenant",
      <i className="fa fa-laptop" />
    ),

    getItem(
      <Link to="/personal-user/authentication">Bảo mật</Link>,
      "authentication",
      <i className="fa fa-lock" />
    ),

    getItem("Đăng xuất", "logout", <LogoutOutlined />),
  ];

  const handleChangeMenu = (e) => {
    if (e.key === "logout") {
      logout();
    }
  };

  return (
    <div
      className={classNames({ cui__layout__grayBackground: isGrayBackground })}
    >
      <IdleTimer />
      <Layout
        className={classNames({
          cui__layout__contentMaxWidth: isContentMaxWidth,
          cui__layout__appMaxWidth: isAppMaxWidth,
          cui__layout__grayBackground: isGrayBackground,
          cui__layout__squaredBorders: isSquaredBorders,
          cui__layout__cardsShadow: isCardShadow,
          cui__layout__borderless: isBorderless,
        })}
      >
        {/* <Sidebar /> */}
        {/* <SupportChat /> */}
        <MenuMain />
        <Layout>
          <Breadcrumbs />
          <Layout.Content style={{ height: "100%", position: "relative" }}>
            <div className="cui__utils__content">
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Row justify="center">
                      <Avatar size={128} icon={<UserOutlined />} />
                    </Row>
                    <p style={{ textAlign: "center" }}>
                      <b>
                        {user.fullName || "Họ và tên"} -{" "}
                        {user.tenant.name || "Công ty"}
                      </b>
                    </p>
                    <Menu
                      style={{
                        width: "100%",
                        borderRight: 0,
                      }}
                      onClick={(e) => handleChangeMenu(e)}
                      selectedKeys={selectedMenu}
                      items={items}
                    />
                  </Card>
                </Col>
                <Col span={18}>
                  <div>{children}</div>
                </Col>
              </Row>
            </div>
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default SubMainLayout;
