import request from "@/utils/request";

const POST_BASE_URL = "/api/v1/post";

const PostAPI = {
  /** 获取岗位下拉列表 */
  getOptions() {
    return request<any, ResponseData<OptionType[]>>({
      url: `${POST_BASE_URL}/options`,
      method: "get",
    });
  },
};

export default PostAPI;

/** 岗位类型 */
export interface PostVO {
  /** 岗位ID */
  postId?: string | number;
  /** 岗位名称 */
  postName?: string;
  /** 岗位编码 */
  code?: string;
  /** 状态(1:启用;0:禁用) */
  status?: number;
}
