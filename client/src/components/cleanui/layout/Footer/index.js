import style from "./style.module.scss";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="font-weight-bold">
          ĐẠI HỌC BÁCH KHOA HÀ NỘI - TRƯỜNG CNTT & TT | SOICT
        </p>
        <p>Địa chỉ: số 1 Đại Cồ Việt</p>
        <p>Tel: </p>
      </div>
    </div>
  );
};

export default Footer;
