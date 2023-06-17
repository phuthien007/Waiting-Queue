import { useSelector } from "react-redux";
import { selectUser } from "store/userSlice";
import { Button, Col, Row } from "antd";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import style from "./style.module.scss";
import QrCodeComponent from "components/dashboard/QrCode";

const TopBar = () => {
  const user = useSelector(selectUser);
  return (
    <div
      style={{ width: "100%", justifyContent: "flex-end" }}
      className={style.topbar}
    >
      {/* <div className="mr-4">
        <FavPages />
      </div>
      <div className="mr-auto">
        <Search />
      </div>
      <div className="mr-4 d-none d-md-block">
        <IssuesHistory />
      </div>
      <div className="mb-0 mr-auto d-xl-block d-none">
        <ProjectManagement />
      </div>
      <div className="mr-4 d-none d-sm-block">
        <LanguageSwitcher />
      </div>
      <div className="mr-4 d-none d-sm-block">
        <Actions />
      </div> */}
      {!user.authorized ? (
        <Row justify="end">
          <Col span={12}>
            <QrCodeComponent />
          </Col>
          <Col span={12}>
            <Button
              className="mr-4"
              icon={<i className="fe fe-log-in mr-2" />}
              // type="link"
              href="/auth/login"
            >
              Đăng nhập
            </Button>
          </Col>
        </Row>
      ) : (
        <div className="mt-2 mr-5">
          <UserMenu />
        </div>
      )}
    </div>
  );
};

export default TopBar;
