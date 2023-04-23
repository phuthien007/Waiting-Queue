import { createSlice } from "@reduxjs/toolkit";
import store from "store";
import qs from "qs";
import { history } from "index";

const STORED_SETTINGS = (storedSettings) => {
  const settings = {};
  Object.keys(storedSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== "undefined" ? item : storedSettings[key];
  });
  return settings;
};

const initialState = {
  ...STORED_SETTINGS({
    authProvider: "jwt", // firebase, jwt
    logo: "Waiting Queue",
    locale: "vi-VN",
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    menuLayoutType: "left", // left, top, nomenu
    routerAnimation: "slide-fadein-up", // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    menuColor: "white", // white, dark, gray
    theme: "default", // default, dark
    authPagesColor: "image", // white, gray, image
    primaryColor: "#4bbdf3",
    leftMenuWidth: 256,
    isMenuUnfixed: false,
    isMenuShadow: false,
    isTopbarFixed: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
  }),
};

const addStyles = (color) => {
  const styleElement = document.querySelector("#primaryColor");
  if (styleElement) {
    styleElement.remove();
  }
  const body = document.querySelector("body");
  const styleEl = document.createElement("style");
  const css = document.createTextNode(
    `:root { --kit-color-primary: ${color};}`
  );
  styleEl.setAttribute("id", "primaryColor");
  styleEl.appendChild(css);
  body.appendChild(styleEl);
};

export const setup = () => (dispatch, getState) => {
  const parseSettings = (search) => {
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    Object.keys(query).forEach((key) => {
      let value;
      switch (query[key]) {
        case "false":
          value = false;
          break;
        case "true":
          value = true;
          break;
        default:
          value = query[key];
          break;
      }
      if (key === "theme") {
        dispatch(setTheme({ theme: value }));
        return;
      }
      dispatch(changeSettings({ setting: key, value }));
    });
  };
  parseSettings(history.location.search);

  history.listen((params) => {
    const { search } = params;
    parseSettings(search);
  });

  // set primary color on app load
  const primaryColor = () => {
    const color = store.get("app.settings.primaryColor");
    if (color) {
      dispatch(setPrimaryColor({ color }));
    }
  };
  primaryColor();

  // init theme on app load
  const initTheme = () => {
    const { search } = history.location;
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    const theme = query.theme || store.get("app.settings.theme") || "default";
    dispatch(setTheme({ theme }));
  };
  initTheme();

  // detect isMobileView setting on app load and window resize
  const isMobileView = (load = false) => {
    const currentState = global.window.innerWidth < 768;
    const prevState = store.get("app.settings.isMobileView");
    if (currentState !== prevState || load) {
      dispatch(
        changeSettings({ setting: "isMobileView", value: currentState })
      );
    }
  };

  // detect viewport width on app load and window resize
  const isMenuToggled = () => {
    const shouldToggle = global.window.innerWidth < 1024;
    const prevState = store.get("app.settings.isMenuCollapsed");
    if (shouldToggle || prevState) {
      dispatch(changeSettings({ setting: "isMenuCollapsed", value: true }));
    }
  };

  isMobileView(true);
  isMenuToggled();
  window.addEventListener("resize", () => {
    isMobileView();
    isMenuToggled();
  });
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeSettings: (state, { payload: { setting, value } }) => {
      store.set(`app.settings.${setting}`, value);
      state[setting] = value;
    },
    setPrimaryColor: (state, { payload: { color } }) => {
      addStyles(color);
      state.primaryColor = color;
    },
    setTheme: (state, { payload: { theme } }) => {
      const nextTheme = theme === "dark" ? "dark" : "default";
      document.querySelector("html").setAttribute("data-kit-theme", nextTheme);
      state.theme = nextTheme;
    },
  },
  extraReducers: {},
});

export const { changeSettings, setPrimaryColor, setTheme } =
  settingSlice.actions;

export const selectSettings = ({ settings }) => settings;

export default settingSlice.reducer;
