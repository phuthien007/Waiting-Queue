import style from "./style.module.scss";

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="font-weight-bold">
          {/* icon copyright */}
          2023
          <span className="mr-1 ml-1">
            <i className="fa fa-copyright" />
          </span>
          Copyright - TRẦN THIỆN PHÚ | OTIS TRAN | WEB DEVELOPER
        </p>
        <p>Tel: 0941556192</p>
      </div>
    </div>
  );
};

export default Footer;
