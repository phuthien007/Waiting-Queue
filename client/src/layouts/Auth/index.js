import { useSelector } from "react-redux";
import { Layout } from "antd";
import classNames from "classnames";
import { selectSettings } from "store/settingSlice";
import { useNavigate } from "react-router-dom";
import { selectUser } from "store/userSlice";
import { useEffect } from "react";
import style from "./style.module.scss";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const { isCardShadow, isSquaredBorders, isBorderless, authPagesColor } =
    useSelector(selectSettings);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user.authorized) navigate("/home");
  }, [navigate, user.authorized]);

  return (
    <Layout>
      <Layout.Content>
        {/* <Sidebar />
        <SupportChat /> */}
        <div
          className={classNames(`${style.container}`, {
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
            [style.white]: authPagesColor === "white",
            [style.gray]: authPagesColor === "gray",
          })}
          style={{
            backgroundImage:
              authPagesColor === "image"
                ? "url(/resources/images/auth/bg1.jpg)"
                : "",
          }}
        >
          <div className={style.containerInner}>{children}</div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default AuthLayout;
