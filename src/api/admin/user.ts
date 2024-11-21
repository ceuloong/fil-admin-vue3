import request from "@/utils/request";
import { DeptVO } from "@/api/admin/dept";

const USER_BASE_URL = "/api/v1/user";
const SYS_USER_URL = "/api/v1/sys-user";

const UserAPI = {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  getInfo() {
    return request<any, ResponseData<UserInfo>>({
      url: `/api/v1/getinfo`,
      method: "get",
    });
  },

  /**
   * 获取用户分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: UserPageQuery) {
    return request<any, ResponseData<PageResult<UserPageVO[]>>>({
      url: `${SYS_USER_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取用户表单详情
   *
   * @param userId 用户ID
   * @returns 用户表单详情
   */
  getFormData(userId: number) {
    return request<any, ResponseData<UserForm>>({
      url: `${SYS_USER_URL}/${userId}`,
      method: "get",
    });
  },

  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  add(data: UserForm) {
    return request({
      url: `${SYS_USER_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update(data: UserForm) {
    return request({
      url: `${SYS_USER_URL}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 修改用户密码
   *
   * @param id 用户ID
   * @param password 新密码
   */
  resetPassword(id: number, password: string) {
    return request({
      url: `${USER_BASE_URL}/${id}/password/reset`,
      method: "put",
      params: { password: password },
    });
  },

  /**
   * 修改用户状态
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  updateStatus(id: number, status: number) {
    const data = {
      userId: id,
      status: status,
    };
    return request({
      url: `${USER_BASE_URL}/status`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: (number | undefined)[]) {
    return request({
      url: `${SYS_USER_URL}`,
      method: "delete",
      data: { ids: ids },
    });
  },

  /** 下载用户导入模板 */
  downloadTemplate() {
    return request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "arraybuffer",
    });
  },

  /**
   * 导出用户
   *
   * @param queryParams 查询参数
   */
  export(queryParams: UserPageQuery) {
    return request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "arraybuffer",
    });
  },

  /**
   * 导入用户
   *
   * @param deptId 部门ID
   * @param file 导入文件
   */
  import(deptId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      params: { deptId: deptId },
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 获取个人中心用户信息 */
  getProfile() {
    return request<any, ResponseData<UserProfileVO>>({
      url: `${USER_BASE_URL}/profile`,
      method: "get",
    });
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm) {
    return request({
      url: `${USER_BASE_URL}/profile`,
      method: "put",
      data: data,
    });
  },

  /** 修改个人中心用户密码 */
  changePassword(data: PasswordChangeForm) {
    return request({
      url: `${USER_BASE_URL}/password`,
      method: "put",
      data: data,
    });
  },

  /**
   *   发送手机/邮箱验证码
   *
   * @param contact 联系方式  手机号/邮箱
   * @param contactType 联系方式类型 MOBILE:手机;EMAIL:邮箱
   */
  sendVerificationCode(contact: string, contactType: string) {
    return request({
      url: `${USER_BASE_URL}/send-verification-code`,
      method: "get",
      params: { contact: contact, contactType: contactType },
    });
  },

  /** 绑定个人中心用户手机 */
  bindMobile(data: MobileBindingForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "put",
      data: data,
    });
  },

  /** 绑定个人中心用户邮箱 */
  bindEmail(data: EmailBindingForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "put",
      data: data,
    });
  },

  /**
   *  获取用户下拉列表
   */
  getOptions() {
    return request<any, OptionType[]>({
      url: `${USER_BASE_URL}/options`,
      method: "get",
    });
  },
};

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  roles: string[];

  /** 权限 */
  permissions: string[];
}

/**
 * 用户分页查询对象
 */
export interface UserPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;

  /** 用户状态 */
  status?: number;

  /** 部门ID */
  deptId?: number;

  /** 创建时间范围 */
  createdAt?: [string, string];

  /** 排序字段 */ // 添加索引签名支持动态属性
  [key: string]: string | number | [string, string] | undefined; // 修改这里，添加数组类型
}

/** 用户分页对象 */
export interface UserPageVO {
  /** 用户头像URL */
  avatar?: string;
  /** 创建时间 */
  createdAt?: Date;
  /** 部门名称 */
  dept?: DeptVO;
  /** 用户邮箱 */
  email?: string;
  /** 性别 */
  sex?: string;
  /** 用户ID */
  userId?: number;
  /** 手机号 */
  phone?: string;
  /** 用户昵称 */
  nickName?: string;
  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;
  /** 用户状态(1:启用;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

/** 用户表单类型 */
export interface UserForm {
  /** 用户头像 */
  avatar?: string;
  /** 部门ID */
  deptId?: number;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  sex?: string;
  /** 用户ID */
  userId?: number;
  /** 手机号 */
  phone?: string;
  /** 昵称 */
  nickName?: string;
  /** 角色ID集合 */
  roleId?: number;
  /** 用户状态(1:正常;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
  /** 密码 */
  password?: string | undefined;
  /** 岗位ID */
  postId?: number;
  /** 备注 */
  remark?: string;
}

/** 个人中心用户信息 */
export interface UserProfileVO {
  post?: PostsVO[];
  roles?: RolesVO[];
  user?: UserVO;
}

/** 个人中心用户信息表单 */
export interface UserProfileForm {
  /** 用户ID */
  id?: number;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 性别 */
  gender?: number;

  /** 手机号 */
  mobile?: string;

  /** 邮箱 */
  email?: string;
}

/** 修改密码表单 */
export interface PasswordChangeForm {
  /** 原密码 */
  oldPassword?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认新密码 */
  confirmPassword?: string;
}

/** 修改手机表单 */
export interface MobileBindingForm {
  /** 手机号 */
  mobile?: string;
  /** 验证码 */
  code?: string;
}

/** 修改邮箱表单 */
export interface EmailBindingForm {
  /** 邮箱 */
  email?: string;
  /** 验证码 */
  code?: string;
}

/** 岗位信息 */
export interface PostsVO {
  /** 岗位ID */
  postId?: number;
  /** 岗位名称 */
  postName?: string;
  /** 岗位编码 */
  postCode?: string;
  /** 状态 */
  status?: number;
  /** 备注 */
  remark?: string;
}

/** 角色信息 */
export interface RolesVO {
  /** 角色ID */
  roleId?: number;
  /** 角色名称 */
  roleName?: string;
  /** 角色编码 */
  status?: string;
  /** 角色编号 */
  roleKey?: string;
  /** 备注 */
  remark?: string;
}

/** 用户信息 */
export interface UserVO {
  /** 用户ID */
  userId?: number;
  /** 用户名 */
  username?: string;
  /** 昵称 */
  nickName?: string;
  /** 头像URL */
  avatar?: string;
  /** 角色 */
  roleIds?: number[];
  /** 创建时间 */
  createdAt?: Date;
  /** 部门名称 */
  dept?: DeptVO;
  /** 用户邮箱 */
  email?: string;
  /** 性别 */
  sex?: string;
  /** 手机号 */
  phone?: string;
  /** 用户状态 */
  status?: number;
}
