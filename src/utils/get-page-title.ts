import storage from "./storage";

export default function getPageTitle(pageTitle: string) {
  const app_info = storage.get("app_info");
  const title = app_info ? app_info.sys_app_name : "后台管理系统";
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
