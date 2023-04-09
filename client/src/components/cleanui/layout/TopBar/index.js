import { useSelector } from "react-redux";
import { selectUser } from "store/userSlice";
import { Button } from "antd";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import style from "./style.module.scss";

const TopBar = () => {
  const user = useSelector(selectUser);
  return (
    <div className={style.topbar}>
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
        <div className="mr-4 d-none d-sm-block">
          <Button>Login</Button>
        </div>
      ) : (
        <div className="">
          <UserMenu />
        </div>
      )}
    </div>
  );
};

export default TopBar;
