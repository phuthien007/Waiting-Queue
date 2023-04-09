import { useEffect } from "react";
import { useSelector } from "react-redux";
import { notification } from "antd";
import { history } from "index";
import { selectUser } from "store/userSlice";

const ACL = ({
  redirect = false,
  defaultRedirect = "/error/404",
  roles = [],
  children,
}) => {
  const { role } = useSelector(selectUser);

  useEffect(() => {
    const authorized = roles.filter((item) => role.includes(item)).length > 0;
    // if user not equal needed role and if component is a page - make redirect to needed route
    if (!authorized && redirect) {
      const url = typeof redirect === "boolean" ? defaultRedirect : redirect;
      notification.error({
        message: "Lỗi",
        description: (
          <div>
            Bạn không đủ quyền truy cập hoặc đường dẫn này không tồn tại.
            <br />
            Chuyển trang &#34;{url}&#34;
          </div>
        ),
      });
      history.push(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authorized = roles.filter((item) => role.includes(item)).length > 0;
  const AuthorizedChildren = () => {
    // if user not authorized return null to component
    if (!authorized) {
      return null;
    }

    // if access is successful render children
    return <>{children}</>;
  };

  return AuthorizedChildren();
};

export default ACL;
