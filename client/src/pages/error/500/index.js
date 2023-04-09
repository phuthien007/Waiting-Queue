import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const System500 = () => {
  return (
    <div>
      <Helmet title="Page 500" />
      <div className="container pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-32">
        <div className="font-weight-bold mb-3">Lỗi server</div>
        <div className="text-gray-6 font-size-24">
          Có lỗi xảy ra, xin vui lòng thử lại sau.
        </div>
        <div className="font-weight-bold font-size-70 mb-1">500 —</div>
        <Link to="/" className="btn btn-outline-primary">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default System500;
