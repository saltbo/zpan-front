<template>
  <div>
    <el-dialog :title="$t('dialog.upload-title')" :visible.sync="visible" width="400px">
      {{ destDir }}
      <el-upload class="upload-demo" action :http-request="handleUpload" :file-list="fileList" :limit="20" :on-exceed="handleExceed" drag multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          {{ $t("dialog.upload-tips") }}
          <em>{{ $t("dialog.upload-click") }}</em>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { zfile } from "@/libs/zpan";
import mixinDialog from "@/libs/mixin-dialog.js";
export default {
  name: "Uploader",
  mixins: [mixinDialog],
  props: {
    sid: Number,
    destDir: String,
  },
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    visible(newValue, oldValue) {
      this.fileList = [];
    },
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`每次最多允许 20 个文件同时上传，请分批操作！`);
    },
    handleUpload(fileObj) {
      fileObj.filename = fileObj.file.name;

      zfile.upload(Number(this.sid), fileObj, this.destDir).then(this.finish);
    },
  },
};
</script>

<style scoped>
</style>