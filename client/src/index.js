import "antd/lib/style/index.less"; // antd core styles
import "./components/kit/vendors/antd/themes/default.less"; // default theme antd components
import "./components/kit/vendors/antd/themes/dark.less"; // dark theme antd components
import "./global.scss"; // app & third-party component styles

import { createRoot } from "react-dom/client";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { notification } from "antd";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// eslint-disable-next-line import/no-named-default
import { default as storeBase } from "store";
import ReactGA from "react-ga4";
import store from "./store";
import Localization from "./localization";
import * as serviceWorker from "./serviceWorker";
import AppRouter from "./router";

ReactGA.initialize(process.env.REACT_APP_GA4);

const history = createBrowserHistory();

const handleError = (error) => {
  // Errors handling
  console.log("error in react-query");
  const { response } = error;
  const { data, status } = response;
  if (data) {
    let messageError;
    if (data.title) {
      messageError = data.title;
    } else if (data.errorMessage) {
      messageError = data.errorMessage;
    } else if (data.message) {
      messageError = data.message;
    } else if (data.fieldErrors) {
      messageError = data.fieldErrors[0].message;
    } else {
      messageError = data.title || "Có lỗi xảy ra";
    }

    if (status === 403) {
      notification.error({
        message: "Lỗi",
        description: "Không có quyền để sử dụng chức năng này",
      });
      // history.push("/error/403");
    } else if (status === 401) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng đăng nhập lại",
      });
      history.push("/auth/login");
    } else if (status === 400) {
      notification.error({
        message: "Lỗi",
        description: messageError,
      });
    } else if (status >= 400 && status <= 410) {
      notification.error({
        message: "Lỗi",
        description: messageError,
      });
    } else if (status !== 200 && status !== 201 && status !== 204) {
      notification.error({
        message: "Lỗi",
        description: messageError,
      });
    }
  }
};
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        handleError(error);
      },
    },
    queries: {
      enabled: false,
      onError: (error) => {
        handleError(error);
      },
      retry: (failureCount, error) => {
        const { status } = error.response;
        if (status === 401 || status === 403) {
          return false;
        }

        return failureCount <= 3;
      },
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Localization>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <AppRouter history={history} />
      </QueryClientProvider>
    </Localization>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export { store, history };
