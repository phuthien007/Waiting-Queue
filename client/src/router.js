import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { Route, Navigate, Routes, Router } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useSelector } from "react-redux";

import Layout from "layouts";
import { selectSettings } from "store/settingSlice";
import System404 from "pages/error/404";

const routes = [
  // personal-user
  // {
  //   path: '/personal-user',
  //   Component: lazy(() => import('pages/personal-user')),
  //   exact: true,
  // },
  // home
  {
    path: "home",
    Component: lazy(() => import("pages/dashboard")),
    exact: true,
  },
  {
    path: "public/home",
    Component: lazy(() => import("pages/dashboard/public")),
    exact: true,
  },

  // // personal user
  // {
  //   path: "personal-user/profile",
  //   Component: lazy(() => import("pages/personal-user/profile")),
  //   exact: true,
  // },

  // // setting

  // {
  //   path: "personal-user/authentication",
  //   Component: lazy(() => import("pages/personal-user/authentication")),
  //   exact: true,
  // },
  // // {
  // //   path: "personal-user/active-sessions",
  // //   Component: lazy(() => import("pages/personal-user/sessions")),
  // //   exact: true,
  // // },
  // {
  //   path: "personal-user/change-pw",
  //   Component: lazy(() => import("pages/personal-user/change-password")),
  //   exact: true,
  // },
  // {
  //   path: '/personal-user/profile',
  //   Component: lazy(() => import('pages/personal-user/profile')),
  //   exact: true,
  // },
  // {
  //   path: '/personal-user/change-pw',
  //   Component: lazy(() => import('pages/personal-user/change-password')),
  //   exact: true,
  // },

  // administration
  // {
  //   path: "manage/doc-types",
  //   Component: lazy(() => import("pages/administration/doc-types")),
  //   exact: true,
  // },
  // {
  //   path: "manage/doc-groups",
  //   Component: lazy(() => import("pages/administration/doc-groups")),
  //   exact: true,
  // },
  // {
  //   path: "manage/agents",
  //   Component: lazy(() => import("pages/administration/agents")),
  //   exact: true,
  // },
  // {
  //   path: "manage/users",
  //   Component: lazy(() => import("pages/administration/accounts")),
  //   exact: true,
  // },

  // {
  //   path: "manage/files",
  //   Component: lazy(() => import("pages/administration/files")),
  //   exact: true,
  // },
  // {
  //   path: "manage/configurations",
  //   Component: lazy(() => import("pages/administration/configurations")),
  //   exact: true,
  // },
  // {
  //   path: "manage/e-ticket/systems",
  //   Component: lazy(() => import("pages/administration/e-tickets/systems")),
  //   exact: true,
  // },
  // {
  //   path: "manage/e-ticket/sub-systems",
  //   Component: lazy(() => import("pages/administration/e-tickets/sub-systems")),
  //   exact: true,
  // },
  // manage ticket
  // {
  //   path: "e-ticket",
  //   Component: lazy(() => import("pages/tickets")),
  //   exact: true,
  // },
  // {
  //   path: "e-ticket/:id/view",
  //   Component: lazy(() => import("pages/tickets/detail")),
  //   exact: true,
  // },
  // {
  //   path: "my-eticket",
  //   Component: lazy(() => import("pages/tickets")),
  //   exact: true,
  // },
  // {
  //   path: "my-eticket/:id/view",
  //   Component: lazy(() => import("pages/tickets/detail")),
  //   exact: true,
  // },

  // statistic
  // {
  //   path: "reports/receive",
  //   Component: lazy(() => import("pages/reports/statistic-receives")),
  //   exact: true,
  // },

  // {
  //   path: "reports/send",
  //   Component: lazy(() => import("pages/reports/statistic-sends")),
  //   exact: true,
  // },
  // {
  //   path: "reports/comment",
  //   Component: lazy(() => import("pages/reports/statistic-responses")),
  //   exact: true,
  // },

  // publish document
  // {
  //   path: "documents/publish",
  //   Component: lazy(() => import("pages/publish-document")),
  //   exact: true,
  // },

  // publish document view detail
  // {
  //   path: "documents/:id/viewp",
  //   Component: lazy(() => import("pages/publish-document/detail")),
  //   exact: true,
  // },
  // document
  // {
  //   path: "documents",
  //   Component: lazy(() => import("pages/document")),
  //   exact: true,
  // },

  // // document view detail
  // {
  //   path: "documents/:id/view",
  //   Component: lazy(() => import("pages/document/detail")),
  //   exact: true,
  // },
  // Auth Pages
  {
    path: "auth/login",
    Component: lazy(() => import("pages/auth/login")),
    exact: true,
  },
  // {
  //   path: "auth/login/AD",
  //   Component: lazy(() => import("pages/auth/login/AD")),
  //   exact: true,
  // },
  {
    path: "auth/forgot-password",
    Component: lazy(() => import("pages/auth/forgot-password")),
    exact: true,
  },
  {
    path: "auth/reset-password",
    Component: lazy(() => import("pages/auth/reset-password")),
    exact: true,
  },

  {
    path: "error/403",
    Component: lazy(() => import("pages/error/403")),
    exact: true,
  },
  {
    path: "error/404",
    Component: lazy(() => import("pages/error/404")),
    exact: true,
  },
  {
    path: "error/500",
    Component: lazy(() => import("pages/error/500")),
    exact: true,
  },
];

const AppRouter = ({ history, basename }) => {
  const { routerAnimation } = useSelector(selectSettings);
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  const renderRoute = ({ path, children, Component }) => {
    return (
      <Route
        path={path}
        key={path}
        element={
          <div className={routerAnimation}>
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          </div>
        }
      >
        {children?.map((item) => renderRoute(item))}
      </Route>
    );
  };

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          {routes.map((item) => renderRoute(item))}
          <Route path="*" element={<System404 />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;