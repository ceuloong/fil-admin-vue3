<template>
  <el-form
    ref="form"
    :model="passwordChangeForm"
    :rules="passwordChangeRules"
    label-width="80px"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="passwordChangeForm.oldPassword"
        placeholder="请输入旧密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="passwordChangeForm.newPassword"
        placeholder="请输入新密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="passwordChangeForm.confirmPassword"
        placeholder="请确认密码"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import UserAPI, { PasswordChangeForm } from "@/api/admin/user";
import router from "@/router";

const passwordChangeForm = reactive<PasswordChangeForm>({});

// 修改密码校验规则
const passwordChangeRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
  ],
};

const handleSubmit = () => {
  if (passwordChangeForm.newPassword !== passwordChangeForm.confirmPassword) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }
  UserAPI.changePassword(passwordChangeForm).then(() => {
    ElMessage.success("密码修改成功");
  });
};
const close = () => {
  //handleCloseDialog();
  router.push({ path: "/index" });
};
</script>
