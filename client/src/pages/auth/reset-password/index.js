import { Helmet } from "react-helmet";
import ResetPassword from "components/cleanui/system/Auth/ResetPassword";

const SystemResetPassword = () => {
  return (
    <div>
      <Helmet title="Lấy lại mật khẩu" />
      <ResetPassword />
    </div>
  );
};

export default SystemResetPassword;
