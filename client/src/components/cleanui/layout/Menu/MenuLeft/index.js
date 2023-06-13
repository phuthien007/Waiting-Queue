import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Layout } from "antd";
import classNames from "classnames";
import store from "store";
import PerfectScrollbar from "react-perfect-scrollbar";
import { find } from "lodash";
import menuData from "services/menu";
import { useDispatch, useSelector } from "react-redux";
import { changeSettings, selectSettings } from "store/settingSlice";
import { selectUser } from "store/userSlice";
import style from "./style.module.scss";

const MenuLeft = () => {
  const dispatch = useDispatch();
  const {
    isMenuCollapsed,
    isMobileView,
    isMenuUnfixed,
    isMenuShadow,
    leftMenuWidth,
    menuColor,
    logo,
  } = useSelector(selectSettings);
  const { role } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(
    store.get("app.menu.selectedKeys") || []
  );
  const [openedKeys, setOpenedKeys] = useState(
    store.get("app.menu.openedKeys") || []
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

  const onCollapse = (value, type) => {
    if (type === "responsive" && isMenuCollapsed) {
      return;
    }
    dispatch(
      changeSettings({ setting: "isMenuCollapsed", value: !isMenuCollapsed })
    );
    setOpenedKeys([]);
  };

  const onOpenChange = (keys) => {
    store.set("app.menu.openedKeys", keys);
    setOpenedKeys(keys);
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
        if (!checkArr) {
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

  const menuSettings = isMobileView
    ? {
        width: leftMenuWidth,
        collapsible: false,
        collapsed: false,
        onCollapse,
      }
    : {
        width: leftMenuWidth,
        collapsible: true,
        collapsed: isMenuCollapsed,
        onCollapse,
        breakpoint: "lg",
      };

  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === "white",
        [style.gray]: menuColor === "gray",
        [style.dark]: menuColor === "dark",
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsed && !isMobileView ? 80 : leftMenuWidth,
          height:
            isMobileView || isMenuUnfixed
              ? "calc(100% - 64px)"
              : "calc(100% - 110px)",
        }}
      >
        {/* <div className="mr-4" style={{ marginTop: "0.8rem" }}>
        <Actions />
      </div> */}
        <div className={`${style.logoContainer} mt-4 mb-4`}>
          <div className={`${style.logo} mb-4`}>
            <img
              onClick={() => {
                location.href = "/";
              }}
              src="/resources/images/tf-logo.svg"
              style={{ height: "110px", width: "100%" }}
              className="mr-2 mt-4"
              alt="Waiting Queue"
            />
            {/* <div className={style.name}>{logo}</div> */}
            {/* {logo === "Waiting" && <div className={style.descr}>QUEUE</div>} */}
          </div>
        </div>
        <PerfectScrollbar className="mt-4">
          <Menu
            onClick={handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            className={style.navigation}
            inlineIndent="15"
          >
            {generateMenuItems()}
          </Menu>
        </PerfectScrollbar>
      </div>
    </Layout.Sider>
  );
};

export default MenuLeft;
