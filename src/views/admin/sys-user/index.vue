<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <DeptTree
          v-model="queryParams.deptId"
          @update:model-value="handleQuery"
        />
      </el-col>

      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                class="!w-[100px]"
              >
                <el-option label="正常" :value="2" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryParams.createdAt"
                :editable="false"
                class="!w-[240px]"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery">
                <template #icon><Search /></template>
                搜索
              </el-button>
              <el-button @click="handleResetQuery">
                <template #icon><Refresh /></template>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never" class="table-container">
          <template #header>
            <div class="flex-x-between">
              <div>
                <el-button
                  v-hasPerm="['sys:user:add']"
                  type="success"
                  @click="handleOpenDialog()"
                >
                  <template #icon><Plus /></template>
                  新增
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                >
                  <template #icon><Delete /></template>
                  删除
                </el-button>
              </div>
              <div>
                <el-button class="ml-3" @click="handleOpenImportDialog">
                  <template #icon><Upload /></template>
                  导入
                </el-button>

                <el-button class="ml-3" @click="handleExport">
                  <template #icon><Download /></template>
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            border
            :data="pageData"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="userId"
              label="编号"
              align="center"
              prop="userId"
              width="80"
            />
            <el-table-column
              key="username"
              label="用户名"
              align="center"
              prop="username"
              sortable="custom"
            />
            <el-table-column label="用户昵称" align="center" prop="nickName" />

            <el-table-column
              label="性别"
              width="100"
              align="center"
              prop="sex"
            />

            <el-table-column
              label="部门"
              width="150"
              align="center"
              prop="dept.deptName"
            />
            <el-table-column
              label="手机号码"
              align="center"
              prop="phone"
              width="120"
            />

            <el-table-column
              label="状态"
              align="center"
              prop="status"
              width="100"
            >
              <template #default="scope">
                <el-tag :type="scope.row.status == 2 ? 'success' : 'info'">
                  {{ scope.row.status == 2 ? "正常" : "禁用" }}
                </el-tag>
                <el-switch
                  v-model="scope.row.status"
                  active-value="2"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createdAt"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  v-hasPerm="['admin:sysUser:resetPassword']"
                  type="primary"
                  size="small"
                  link
                  @click="hancleResetPassword(scope.row)"
                >
                  <template #icon><RefreshLeft /></template>
                  重置密码
                </el-button>
                <el-button
                  v-hasPerm="['admin:sysUser:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.userId)"
                >
                  <template #icon><Edit /></template>
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['admin:sysUser:delete']"
                  type="danger"
                  link
                  size="small"
                  @click="handleDelete(scope.row.userId)"
                >
                  <template #icon><Delete /></template>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            :total="total"
            :page="queryParams.pageIndex"
            :limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户表单弹窗 -->
    <el-drawer
      v-model="dialog.visible"
      :title="dialog.title"
      append-to-body
      @close="handleCloseDialog"
    >
      <!-- <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.userId"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="formData.nickName" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
          <el-tree-select
            v-model="formData.deptId"
            placeholder="请选择所属部门"
            :data="deptOptions"
            filterable
            check-strictly
            :render-after-expand="false"
            :props="{
              value: 'id',
              label: 'label',
              children: 'children',
            }"
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <dictionary v-model="formData.sex" code="sys_user_sex" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form> -->
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="formData.nickName"
                placeholder="请输入用户昵称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                v-model="formData.deptId"
                placeholder="请选择所属部门"
                :data="deptOptions"
                filterable
                check-strictly
                :render-after-expand="false"
                :props="{
                  value: 'id',
                  label: 'label',
                  children: 'children',
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="formData.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="formData.password"
                placeholder="请输入用户密码"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <dictionary v-model="formData.sex" code="sys_user_sex" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <dictionary v-model="formData.status" code="sys_normal_disable" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select
                v-model="formData.postId"
                placeholder="请选择"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select
                v-model="formData.roleId"
                placeholder="请选择"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 用户导入弹窗 -->
    <UserImport
      v-model:visible="importDialogVisible"
      @import-success="handleUserImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/admin/user";
import DeptAPI from "@/api/admin/dept";
import RoleAPI from "@/api/admin/role";
import PostAPI from "@/api/admin/post";
import { rules } from "@/api/auth";

import DeptTree from "./dept-tree.vue";
import UserImport from "./import.vue";

const queryFormRef = ref(ElForm);
const userFormRef = ref(ElForm);

const loading = ref(false);
const removeIds = ref([]);
const total = ref(0);
const pageData = ref<UserPageVO[]>();
/** 部门下拉选项 */
const deptOptions = ref<OptionType[]>();
/** 角色下拉选项 */
const roleOptions = ref<OptionType[]>();
/** 岗位下拉选项 */
const postOptions = ref<OptionType[]>();
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  pageIndex: 1,
  pageSize: 10,
});

/**  用户弹窗对象  */
const dialog = reactive({
  visible: false,
  title: "",
});

/** 导入弹窗显示状态 */
const importDialogVisible = ref(false);

// 用户表单数据
const formData = reactive<UserForm>({
  status: 1,
  //deptId: null,
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getPage(queryParams)
    .then((res) => {
      pageData.value = res.data.list;
      total.value = res.data.count;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageIndex = 1;
  queryParams.deptId = undefined;
  queryParams.createdAt = undefined;
  handleQuery();
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.userId);
}

/** 排序回调函数 */
function handleSortChange(column: { prop: string; order: string }) {
  if (column.order) {
    const orderValue = column.order === "descending" ? "desc" : "asc";
    const orderKey = `${column.prop}Order`;
    // 使用方括号语法设置动态属性名
    queryParams[orderKey] = orderValue;
  } else {
    // 如果取消排序，删除对应的排序属性
    const orderKey = `${column.prop}Order`;
    delete queryParams[orderKey];
  }

  handleQuery();
}

/** 重置密码 */
function hancleResetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    "请输入用户「" + row.username + "」的新密码",
    "重置密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(
    ({ value }) => {
      if (!value || value.length < 6) {
        // 检查密码是否为空或少于6位
        ElMessage.warning("密码至少需要6位字符，请重新输入");
        return false;
      }
      UserAPI.resetPassword(row.id, value).then(() => {
        ElMessage.success("密码重置成功，新密码是：" + value);
      });
    },
    () => {
      ElMessage.info("已取消重置密码");
    }
  );
}

/** 修改用户状态 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === "2" ? "启用" : "停用";
  ElMessageBox.confirm(
    '确认要"' + text + '""' + row.username + '"用户吗?',
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(
    function () {
      loading.value = true;
      UserAPI.updateStatus(row.userId, row.status)
        .then(() => {
          ElMessage.success(text + "成功");
        })
        .finally(() => {
          loading.value = false;
        });
    },
    function () {
      row.status = row.status === "2" ? "1" : "2";
    }
  );
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  // 加载角色下拉数据源
  roleOptions.value = (await RoleAPI.getOptions()).data;
  // 加载部门下拉数据源
  deptOptions.value = (await DeptAPI.getOptions()).data;
  // 加载岗位下拉数据源
  postOptions.value = (await PostAPI.getOptions()).data;

  if (id) {
    dialog.title = "修改用户";
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, { ...data.data });
    });
  } else {
    dialog.title = "新增用户";
  }
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  // 使用 reactive 重置
  Object.keys(formData).forEach((key) => {
    delete formData[key as keyof typeof formData];
  });
  formData.status = 1; // 重置默认值
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const userId = formData.userId;
      loading.value = true;
      if (userId) {
        UserAPI.update(formData)
          .then(() => {
            ElMessage.success("修改用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.add(formData)
          .then(() => {
            ElMessage.success("新增用户成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 3000);

/** 删除用户 */
function handleDelete(id?: number) {
  const userIds = (id && [id]) || removeIds.value; //.join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    function () {
      loading.value = true;
      UserAPI.deleteByIds(userIds)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info("已取消删除");
    }
  );
}
/** 打开导入弹窗 */
function handleOpenImportDialog() {
  importDialogVisible.value = true;
}

/** 导入用户成功 */
function handleUserImportSuccess() {
  handleQuery();
}

/** 导出用户 */
function handleExport() {
  UserAPI.export(queryParams).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

onMounted(() => {
  handleQuery();
});
</script>
