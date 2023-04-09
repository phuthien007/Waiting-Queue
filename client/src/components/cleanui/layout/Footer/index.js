import style from "./style.module.scss";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="font-weight-bold">
          TRUNG TÂM ĐIỀU ĐỘ HỆ THỐNG ĐIỆN MIỀN BẮC
        </p>
        <p>Địa chỉ: 11 Cửa Bắc, Quận Ba Đình, Hà Nội</p>
        <p>Tel: +84-24-39276151 - Fax: +84-24-39276150</p>
      </div>
    </div>
  );
};

export default Footer;
