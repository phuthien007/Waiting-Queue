import style from "./style.module.scss";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="font-weight-bold">
          @Copyright 2023 - TRẦN THIỆN PHÚ | OTIS TRAN | WEB DEVELOPER
        </p>
        <p>Tel: 0941556192</p>
      </div>
    </div>
  );
};

export default Footer;
