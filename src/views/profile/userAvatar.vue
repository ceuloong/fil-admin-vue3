<template>
  <div>
    <img
      :src="options.img"
      title="点击上传头像"
      class="img-circle img-lg"
      @click="editCropper()"
    />
    <el-dialog
      :title="title"
      v-model="open"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :fixed-box="options.fixedBox"
            @real-time="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            ref="fileInput"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button icon="UploadFilled" size="small">
              上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button icon="Plus" size="small" @click="changeScale(1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="Minus" size="small" @click="changeScale(-1)" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="RefreshLeft" size="small" @click="rotateLeft()" />
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="RefreshRight" size="small" @click="rotateRight()" />
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">
            提 交
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store";
import FileAPI from "@/api/admin/file";
import { VueCropper } from "vue-cropper";
import "vue-cropper/dist/index.css";

const open = ref(false);
const title = ref("修改头像");
const options = reactive({
  img: useUserStore().user.avatar,
  autoCrop: true,
  autoCropWidth: 200,
  autoCropHeight: 200,
  fixedBox: true,
});
const previews = ref({
  url: "",
  img: {
    width: "200px",
    height: "200px",
  },
});

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const cropper = ref();

const editCropper = () => {
  open.value = true;
};

const requestUpload = () => {};

const rotateLeft = () => {
  cropper.value?.rotateLeft();
};

const rotateRight = () => {
  cropper.value?.rotateRight();
};

const changeScale = (num: number) => {
  cropper.value?.changeScale(num);
};

const beforeUpload = (file: File) => {
  console.log(file.type);
  if (file.type.indexOf("image/") === -1) {
    ElMessage.error("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.img = reader.result as string;
    };
  }
};
const uploadImg = async () => {
  try {
    cropper.value.getCropBlob(async (data: any) => {
      const formData = new FormData();
      formData.append("upload[]", data);
      const response = await FileAPI.uploadAvatar(formData);
      console.log("response", response);
      open.value = false;
      options.img = import.meta.env.VITE_APP_API_URL + response.data;
      ElMessage.success(response.msg);
    });
    cropper.value?.clearCrop();
  } catch (error) {
    ElMessage.error("头像上传失败");
  }
};

const realTime = (data: any) => {
  previews.value = {
    url: data.url,
    img: {
      width: `${data.width}px`,
      height: `${data.height}px`,
    },
  };
};
</script>
