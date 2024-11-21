<template>
  <el-form ref="userFormRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" />
    </el-form-item>
    <el-form-item label="手机号码" prop="phone">
      <el-input v-model="user.phone" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio value="0">男</el-radio>
        <el-radio value="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
defineOptions({
  name: "Profile",
  inheritAttrs: false,
});
import UserAPI, { type UserVO, UserForm } from "@/api/admin/user";
import { rules } from "@/api/auth";
import router from "@/router";

const props = defineProps({
  user: {
    type: Object as PropType<UserVO>,
    default: () => ({}),
  },
});

const user = useVModel(props, "user", (val) => {
  console.log(val);
});
const userForm = reactive<UserForm>({
  userId: user.value.userId,
  nickName: user.value.nickName,
  phone: user.value.phone,
  email: user.value.email,
  sex: user.value.sex,
});

const userFormRef = ref(ElForm);
const loading = ref(false);

/** 表单提交 */
const submit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = user.value.userId;
      loading.value = true;
      if (userId) {
        UserAPI.update(userForm)
          .then(() => {
            ElMessage.success("修改用户成功");
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

const close = () => {
  //handleCloseDialog();
  router.push({ path: "/" });
};
</script>
