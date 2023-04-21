/* eslint-disable react-hooks/rules-of-hooks */
// import { useLogoutHook, useMeHook } from "@api/auth";
import {
  useAuthControllerLogoutHook,
  useUsersControllerGetMeHook,
} from "@api/waitingQueue";
import store from "store";

export async function currentAccount() {
  // if (!isAuthenticated()) {
  //   return false;
  // }
  // return {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useUsersControllerGetMeHook()()
    .then((response) => {
      if (response) {
        return response;
      }
      return false;
    })
    .catch((err) => console.log(err));
}

export async function logout() {
  return useAuthControllerLogoutHook()()
    .then(() => {
      store.clearAll();
      return true;
    })
    .catch((err) => console.log(err));
  // return true;
}

// export function isAuthenticated() {
//   // get Authenticate from cookie to check if user is logged in

//   const cookies = document.cookie.split(";");
//   console.log("cookies", cookies);
//   const cookie = cookies.find((c) => c.includes("Authenticate"));
//   return cookie !== undefined;
//   // return store.get("accessToken") !== undefined;
// }
