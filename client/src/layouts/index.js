import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NProgress from "nprogress";
import { Helmet } from "react-helmet";
import menuData from "services/menu";
// import Loader from 'components/cleanui/layout/Loader'
import { loadCurrentAccount, selectUser } from "store/userSlice";
import { useEffect } from "react";
import { setup } from "store/settingSlice";
import settingsConfig from "configs/settingsConfig";
import System403 from "pages/error/403";
import usePageTracking from "components/ga4/usePageTracking";
import PublicLayout from "./Public";
import AuthLayout from "./Auth";
import MainLayout from "./Main";
import SubMainLayout from "./SubMain";
import DetailMainLayout from "./DetailMain";

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  submain: SubMainLayout,
  detailmain: DetailMainLayout,
};

let previousPath = "";

const flatMenu = (menu) => {
  if (!menu) return [];

  const newMenu = menu.map((item) => [
    { title: item.title, url: item.url, roles: item.roles },
    ...flatMenu(item?.children),
  ]);
  return newMenu.flat();
};
const flattedMenu = flatMenu(menuData);
const findURL = (url) => {
  return flattedMenu.find((item) => item.url === url);
};

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { pathname, search } = useLocation();
  console.log("pathname", pathname, search);

  // GA4
  usePageTracking();

  // NProgress & ScrollTop Management
  const currentPath = pathname + search;
  if (currentPath !== previousPath) {
    window.scrollTo(0, 0);
    NProgress.start();
  }
  setTimeout(() => {
    NProgress.done();
    previousPath = currentPath;
  }, 300);

  // Layout Rendering
  const getLayout = () => {
    if (pathname.startsWith("/event")) {
      return "detailmain";
    }
    if (/^\/error(?=\/|$)/i.test(pathname) || pathname.startsWith("/public")) {
      return "public";
    }
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return "auth";
    }
    if (pathname.includes("personal-user")) {
      return "submain";
    }
    return "main";
  };

  const Container = Layouts[getLayout()];
  const isUserAuthorized = user.authorized;
  const isUserLoading = user.loading;
  const isAuthLayout = getLayout() === "auth";
  const isPublicLayout = getLayout() === "public";

  console.log("isAuthLayout", isAuthLayout);
  console.log("isUserAuthorized", isUserAuthorized);
  console.log("isUserLoading", isUserLoading);

  useEffect(() => {
    dispatch(setup());
    if (!isUserAuthorized) dispatch(loadCurrentAccount());

    if (isAuthLayout && isUserAuthorized) navigate("/home");
    if (pathname === "/" && !isUserAuthorized) navigate("/public/home");
    // if (!isAuthLayout && !isUserAuthorized) navigate("/public/home");
  }, [
    dispatch,
    navigate,
    pathname,
    isAuthLayout,
    isPublicLayout,
    isUserAuthorized,
  ]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (
      isUserLoading &&
      !isUserAuthorized &&
      !isAuthLayout &&
      !isPublicLayout
    ) {
      return null;
    }

    // if (isPublicLayout) return <Container>{children}</Container>;
    if (isPublicLayout && isUserAuthorized) navigate("/home");
    // redirect to login page if current is not login page and user not authorized
    if (!isAuthLayout && !isPublicLayout && !isUserAuthorized) {
      console.log("redirect to login page");
      if (!settingsConfig.logout)
        settingsConfig.loginRedirectUrl = `${pathname}${search || ""}`;
      return <Navigate to="/public/home" />;
    }

    // authority url with role
    const menuItem = findURL(currentPath);
    if (menuItem) {
      if (!menuItem?.roles.includes(user.role)) {
        console.log("redirect to 403");
        return (
          <Container>
            <System403 />
          </Container>
        );
      }
    }

    return <Container>{children}</Container>;
  };

  return (
    <>
      <Helmet titleTemplate="Waiting Queue | %s" title="QUEUE" />
      {BootstrappedLayout()}
    </>
  );
};

export default Layout;
