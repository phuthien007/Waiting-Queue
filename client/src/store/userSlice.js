import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as jwt from "services/jwt";
import settingsConfig from "configs/settingsConfig";

export const setUser = createAsyncThunk("user/setUser", async (user) => {
  /*
    You can redirect the logged-in user to a specific route depending on his role
    */
  // if (user.loginRedirectUrl) {
  //   settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
  // }

  return user;
});

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (arg, { dispatch }) => {
    await jwt.logout();

    return dispatch(userLoggedOut());
  }
);

export const loadCurrentAccount = createAsyncThunk(
  "user/loadCurrentAccount",
  async (arg, { getState }) => {
    const { user } = getState();
    const current = await jwt.currentAccount();

    if (current) return { ...user, ...current, authorized: true };

    return { ...user, authorized: false };
  }
);

const initialState = {
  id: "",
  name: "",
  role: "",
  email: "",
  avatar: "",
  authorized: false, // false is default value
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: () => {
      settingsConfig.logout = true;
      return initialState;
    },
  },
  extraReducers: {
    [setUser.fulfilled]: (state, action) => action.payload,
    [loadCurrentAccount.pending]: (state) => {
      return { ...state, authorized: false, loading: true };
    },
    [loadCurrentAccount.fulfilled]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        role: action.payload?.role.split("_").join(" ").toUpperCase() || "ROLE",
        loading: false,
      };
    },
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export default userSlice.reducer;
