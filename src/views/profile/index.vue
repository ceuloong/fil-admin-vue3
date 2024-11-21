<template>
  <BasicLayout>
    <template #wrapper>
      <el-row :gutter="10">
        <el-col :span="6" :xs="24">
          <el-card class="box-card">
            <template #header>
              <div class="clearfix">
                <span>个人信息</span>
              </div>
            </template>
            <div>
              <div class="text-center">
                <userAvatar :user="user" />
              </div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  <svg-icon icon-class="user" />
                  用户名称
                  <div class="pull-right">{{ user.username }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="phone" />
                  手机号码
                  <div class="pull-right">{{ user.phone }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="email" />
                  用户邮箱
                  <div class="pull-right">{{ user.email }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="tree" />
                  所属部门
                  <div class="pull-right">{{ deptName }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="peoples" />
                  所属角色
                  <div class="pull-right">{{ roleName }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="date" />
                  创建日期
                  <div class="pull-right">{{ user.createdAt }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <template #header>
              <div class="clearfix">
                <span>基本资料</span>
              </div>
            </template>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本资料" name="userinfo">
                <userInfo :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="resetPwd">
                <resetPwd :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </BasicLayout>
</template>

<script setup lang="ts">
import userAvatar from "./userAvatar.vue";
import userInfo from "./userInfo.vue";
import resetPwd from "./resetPwd.vue";
import UserAPI, { RolesVO, UserVO, type UserProfileVO } from "@/api/admin/user";
import { DeptVO } from "@/api/admin/dept";
import BasicLayout from "@/layout/BasicLayout.vue";

const userProfile = reactive<UserProfileVO>({});

const user = ref<UserVO>({});
const roleIds = ref<number[]>([]);
const deptName = ref<string>("");
const roleName = ref<string>("");
const roleGroup = ref<RolesVO[]>([]);
const dept = ref<DeptVO>({});
const activeTab = ref("userinfo");

onMounted(async () => {
  loadUserProfile();
});

/** 加载用户信息 */
const loadUserProfile = async () => {
  const res = await UserAPI.getProfile();
  Object.assign(userProfile, { ...res.data });
  if (userProfile.user) {
    user.value = userProfile.user;
    roleIds.value = user.value.roleIds || [];
    dept.value = user.value.dept || {};
    deptName.value = dept.value.deptName || "";
  }
  if (userProfile.roles) {
    roleGroup.value = userProfile.roles;
  }
  if (roleIds.value.length > 0) {
    roleGroup.value.forEach((item) => {
      if (roleIds.value[0] === (item.roleId as number)) {
        roleName.value = item.roleName as string;
      }
    });
  } else {
    roleName.value = "暂无";
  }
};
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 18px 0;
}

.svg-icon {
  margin-right: 5px;
}
</style>
