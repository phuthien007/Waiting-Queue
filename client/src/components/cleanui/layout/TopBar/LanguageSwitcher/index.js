import { Menu, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { changeSettings, selectSettings } from "store/settingSlice";
import styles from "./style.module.scss";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { locale } = useSelector(selectSettings);
  const changeLanguage = ({ key }) => {
    dispatch(changeSettings({ setting: "locale", value: key }));
  };
  const language = locale.substr(0, 2);
  const menu = (
    <Menu selectedKeys={[locale]} onClick={changeLanguage}>
      <Menu.Item key="en-US">
        <span className="text-uppercase font-size-12 mr-2">EN</span>
        English
      </Menu.Item>
      <Menu.Item key="fr-FR">
        <span className="text-uppercase font-size-12 mr-2">FR</span>
        French
      </Menu.Item>
      <Menu.Item key="ru-RU">
        <span className="text-uppercase font-size-12 mr-2">RU</span>
        Русский
      </Menu.Item>
      <Menu.Item key="zh-CN">
        <span className="text-uppercase font-size-12 mr-2">CN</span>
        简体中文
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <div className={styles.dropdown}>
        <span className="text-uppercase">{language}</span>
      </div>
    </Dropdown>
  );
};

export default LanguageSwitcher;
