import { Layout, Row } from "antd";
import { useSelector } from "react-redux";
import classNames from "classnames";
// import TopBar from 'components/cleanui/layout/TopBar'
import Breadcrumbs from "components/cleanui/layout/Breadcrumbs";
import Menu from "components/cleanui/layout/Menu";
import Footer from "components/cleanui/layout/Footer";
import { selectSettings } from "store/settingSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectUser } from "store/userSlice";
import IdleTimer from "components/system/IdleTimer";
import Sidebar from "components/cleanui/layout/Sidebar";
// import Sidebar from 'components/cleanui/layout/Sidebar'
// import SupportChat from 'components/cleanui/layout/SupportChat'
import UserMenu from "components/cleanui/layout/TopBar/UserMenu";
import TopBar from "components/cleanui/layout/TopBar";

const MainLayout = ({ children }) => {
  const {
    isContentMaxWidth,
    isAppMaxWidth,
    isGrayBackground,
    isSquaredBorders,
    isCardShadow,
    isBorderless,
  } = useSelector(selectSettings);
  const navigate = useNavigate();
  const user = useSelector(selectUser);

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
        <Menu />
        <Layout>
          <Row justify="end">
            <TopBar />
          </Row>
          <Breadcrumbs />
          <Layout.Content style={{ height: "100%", position: "relative" }}>
            <div className="cui__utils__content">{children}</div>
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
