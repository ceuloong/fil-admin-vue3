import request from "@/utils/request";

class AuthAPI {
  /** 登录 接口*/
  static login(data: LoginData) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("code", data.code);
    formData.append("uuid", data.uuid);
    return request<any, LoginResult>({
      url: "/api/v1/login",
      method: "post",
      data: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  }

  /** 注销 接口*/
  static logout() {
    return request({
      url: "/api/v1/logout",
      method: "delete",
    });
  }

  /** 获取验证码 接口*/
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: "/api/v1/captcha",
      method: "get",
    });
  }
}

// 查询 此接口不在验证数据权限
export function getSetting() {
  return request<any, AppConfigFronted>({
    url: "/api/v1/app-config",
    method: "get",
  });
}

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  rememberMe?: boolean;
  /** 验证码缓存key */
  code: string;
  /** 验证码 */
  uuid: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  token: string;
  /** 过期时间(单位：毫秒) */
  expire?: string;
  /** 刷新token */
  refreshToken?: string;
  /** token 类型 */
  tokenType?: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  id: string;
  /** 验证码图片Base64字符串 */
  data: string;
}

/** APP 配置 */
export interface AppConfigFronted {
  /** APP LOGO */
  sys_app_logo: string;
  /** APP 名称 */
  sys_app_name: string;
}

// 定义表单规则的类型
interface FormRules {
  email: {
    required?: boolean;
    type?: string;
    message: string;
    trigger: string | string[];
  }[];
  [key: string]: any;
}

/** 用户表单校验规则  */
export const rules: FormRules = {
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleId: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  email: [
    {
      //pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      required: true,
      message: "邮箱地址不能为空",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      required: true,
      message: "手机号码不能为空",
      trigger: "blur",
    },
    {
      pattern:
        /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
};
