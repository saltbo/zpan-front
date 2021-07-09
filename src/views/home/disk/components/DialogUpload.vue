<template>
  <div>
    <el-dialog :title="$t('dialog.upload-title')" :visible.sync="visible" :file-list="fileList" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeConfirm" width="400px">
      {{ destDir }}
      <el-upload ref="uploader" class="uploader" action="" :http-request="handleUpload" :limit="20" :on-progress="handleProgress" :on-success="handleProgress" :on-exceed="handleExceed" :on-remove="handleRemove" drag multiple>
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
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    sid: Number,
    destDir: String,
    listRefresh: Function,
  },
  data() {
    return {
      fileList: [],
      uploading: false,
    };
  },
  methods: {
    closeConfirm(done) {
      if (this.fileList.length > 0 && this.uploading) {
        this.$confirm("文件上传中，取消将终止上传，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "cancel-confirm",
        }).then(() => {
          this.fileList.forEach((file) => {
            this.$refs.uploader.abort(file);
          });
          done();
        });
        return;
      }

      done();
    },

    handleProgress(event, file, fileList) {
      this.uploading = file.status == "uploading";
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`每次最多允许 20 个文件同时上传，请分批操作！`);
    },
    handleRemove(file, fileList) {
      this.$refs.uploader.abort(file);
    },
    handleUpload(fileObj) {
      let abort;
      const cancel = (c) => {
        abort = c;
      };
      fileObj.filename = fileObj.file.name;
      this.$zpan.File.upload(Number(this.sid), fileObj, this.destDir, cancel).then(() => {
        this.completed();
      });
      return {
        abort: () => {
          abort("canceled by the user");
        },
      };
    },
  },
};
</script>

<style >
.cancel-confirm {
  vertical-align: top;
}
</style>