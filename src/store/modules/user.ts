import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useDictStoreHook } from "@/store/modules/dict";

import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/admin/user";
import { resetRouter } from "@/router";
import { removeToken, setToken } from "@/utils/auth";
import storage from "@/utils/storage";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    roles: [],
    permissions: [],
  });
  //const userInfo = useStorage<UserInfo>("userInfo", {} as UserInfo);
  function SET_AVATAR(state: UserInfo) {
    if (!state.avatar) {
      state.avatar = "";
    }
    const avatar = state.avatar;
    if (avatar.indexOf("http") !== -1) {
      state.avatar = avatar;
    } else {
      state.avatar = import.meta.env.VITE_APP_API_URL + avatar;
    }
  }

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data) => {
          const { token } = data;
          console.log("login: token", token);
          setToken(token);
          //localStorage.setItem(TOKEN_KEY, TOKEN_TYPE + " " + token); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((res) => {
          const { data } = res;
          if (!res.data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          if (!data.avatar) {
            data.avatar = "";
          }
          const { avatar } = data;

          if (avatar.indexOf("http") !== -1) {
            data.avatar = avatar;
          } else {
            data.avatar = import.meta.env.VITE_APP_API_URL + avatar;
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          removeToken(); // must remove  token  first
          location.reload(); // 清空路由
          storage.clear(); // 清空缓存
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    return new Promise<void>((resolve) => {
      removeToken();
      resetRouter();
      resolve();
    });
  }

  /**
   *  清理用户会话
   *
   * @returns
   */
  function clearUserSession() {
    return new Promise<void>((resolve) => {
      removeToken();
      usePermissionStoreHook().resetRouter();
      useDictStoreHook().clearDictionaryCache();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
