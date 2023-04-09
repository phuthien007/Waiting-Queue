import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const System403 = () => {
  return (
    <div>
      <Helmet title="Page 403" />
      <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-32">
        <div className="font-weight-bold mb-3">Không có quyền truy cập</div>
        <div className="text-gray-6 font-size-24">
          Bạn không có quyền truy cập chức năng này.
        </div>
        <div className="font-weight-bold font-size-70 mb-1">403 —</div>
        <Link to="/" className="btn btn-outline-primary">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default System403;
