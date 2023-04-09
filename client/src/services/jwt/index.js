/* eslint-disable react-hooks/rules-of-hooks */
// import { useLogoutHook, useMeHook } from "@api/auth";
import store from "store";

export async function currentAccount() {
  // if (!isAuthenticated()) {
  return false;
  // }
  // return {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // return useMeHook()()
  //   .then((response) => {
  //     if (response) {
  //       return response;
  //     }
  //     return false;
  //   })
  //   .catch((err) => console.log(err));
}

export async function logout() {
  // return useLogoutHook()({
  //   uuid: store.get("uuid"),
  // })
  //   .then(() => {
  store.clearAll();
  //     return true;
  //   })
  //   .catch((err) => console.log(err));
  return true;
}

export function isAuthenticated() {
  return store.get("accessToken") !== undefined;
}
