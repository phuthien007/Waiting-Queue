import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Menu, Row, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import store from "store";
import { find } from "lodash";
import menuData from "services/menu";
import { selectSettings } from "store/settingSlice";
import { selectUser } from "store/userSlice";
import style from "./style.module.scss";
import UserMenu from "../../TopBar/UserMenu";
// import Actions from "../../TopBar/Actions";

const MenuTop = () => {
  const { pathname } = useLocation();
  const { menuColor } = useSelector(selectSettings);
  const { role, authorized } = useSelector(selectUser);
  const [selectedKeys, setSelectedKeys] = useState(
    store.get("app.menu.selectedKeys") || []
  );

  useEffect(() => {
    applySelectedKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData]);

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }
        return flattenedItems;
      }, []);
    const selectedItem = find(flattenItems(menuData, "children"), [
      "url",
      pathname,
    ]);
    setSelectedKeys(selectedItem ? [selectedItem.key] : []);
  };

  const handleClick = (e) => {
    store.set("app.menu.selectedKeys", [e.key]);
    setSelectedKeys([e.key]);
  };

  const generateMenuItems = () => {
    const generateItem = (item) => {
      const { key, title, url, icon, disabled, count } = item;
      if (item.category) {
        return null;
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && (
                  <span className="badge badge-success ml-2">{count}</span>
                )}
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && (
                  <span className="badge badge-success ml-2">{count}</span>
                )}
              </Link>
            )}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${style.icon}`} />}
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
        </Menu.Item>
      );
    };
    const generateSubmenu = (items) =>
      items.map((menuItem) => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              {menuItem.icon && (
                <span className={`${menuItem.icon} ${style.icon}`} />
              )}
              <span className={style.title}>{menuItem.title}</span>
              {menuItem.count && (
                <span className="badge badge-success ml-2">
                  {menuItem.count}
                </span>
              )}
            </span>
          );
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          );
        }
        return generateItem(menuItem);
      });
    return menuData.map((menuItem) => {
      if (menuItem.roles && role) {
        const checkArr = menuItem.roles.includes(role);
        if (checkArr.length === 0) {
          return null;
        }
      }

      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            {menuItem.icon && (
              <span className={`${menuItem.icon} ${style.icon}`} />
            )}
            <span className={style.title}>{menuItem.title}</span>
            {menuItem.count && (
              <span className="badge badge-success ml-2">{menuItem.count}</span>
            )}
          </span>
        );
        return (
          <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        );
      }
      return generateItem(menuItem);
    });
  };

  return (
    <div
      className={classNames(
        `${style.menu}`,
        {
          [style.white]: menuColor === "white",
          [style.gray]: menuColor === "gray",
          [style.dark]: menuColor === "dark",
        },
        "py-2"
      )}
    >
      <div className={style.logoContainer}>
        <div className={style.logo}>
          <img
            onClick={() => {
              location.href = "/";
            }}
            src="/resources/images/tf-logo.png"
            height={50}
            className="mr-2"
            alt="Waiting Queue"
          />
        </div>
      </div>
      <div className={style.navigation}>
        <Menu
          onClick={handleClick}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {generateMenuItems()}
        </Menu>
      </div>

      {/* <div className="mr-4" style={{ marginTop: "0.8rem" }}>
        <Actions />
      </div> */}
      {!authorized ? (
        <div className="mt-2 mr-5">
          <Row>
            <Col span={12}>
              <Button
                className="mr-2"
                icon={<i className="fa fa-camera mr-2" />}
                type="primary"
              >
                Mở camera
              </Button>
            </Col>
            <Col span={12}>
              <Button
                className="mr-2"
                icon={<i className="fe fe-log-in mr-2" />}
                type="primary"
                href="/auth/login"
              >
                Đăng nhập
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="mt-2 mr-5">
          <UserMenu />
        </div>
      )}
    </div>
  );
};

MenuTop.defaultProps = {
  logo: "",
  menuColor: "",
  role: [],
};
export default MenuTop;
