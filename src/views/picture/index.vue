<template>
  <div>
    <el-upload action list-type="picture-card" :http-request="handleUpload" :accept="acceptImgs" :file-list="fileList" :on-preview="showPicPreview" :before-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- preview dialog -->
    <el-dialog :visible.sync="dialog.show" :title="dialog.title" center>
      <img width="100%" :src="dialog.imgUrl" alt />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-link" :data-clipboard-text="dialog.imgUrl" @click="dialog.show = false">复制外链</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { zfile } from "@/libs/zpan";
import utils from "@/libs/utils.js";
export default {
  data() {
    return {
      picDir: ".pics/",
      picHost: "",
      acceptImgs: "image/jpeg,image/png,image/gif",
      fileList: [],
      dialog: {
        show: false,
        title: "",
        imgUrl: "",
      },
    };
  },
  methods: {
    listRefresh() {
      zfile.listObjects({ dir: this.picDir }).then((objects) => {
        this.fileList = objects.map((obj) => {
          return { id: obj.id, name: obj.name, url: obj.url };
        });
        this.loading = false;
      });
    },
    handleUpload(fileObj) {
      const loading = this.$loading({
        lock: true,
        text: "Uploading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      var timestamp = new Date().getTime();
      fileObj.filename = fileObj.file.name.replace("image", timestamp);

      zfile
        .upload(fileObj, this.picDir, true)
        .then((ret) => {
          let file = {
            name: fileObj.filename,
            url: ret.data.url,
          };
          this.showPicPreview(file);
          this.listRefresh();
          loading.close();
        })
        .catch(() => {
          this.listRefresh();
          loading.close();
        });
    },
    handleRemove(file, fileList) {
      return this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        `删除${file.name}`,
        {
          type: "warning",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      ).then(() => {
        zfile.delete(file.alias).then((ret) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    showPicPreview(file) {
      this.dialog = {
        show: true,
        title: file.name,
        imgUrl: file.url,
      };
    },
  },
  mounted() {
    this.listRefresh();

    // setup clipboard
    this.$clipboard.on("success", (e) => {
      this.$message.success("复制成功");
      e.clearSelection();
    });
    this.$clipboard.on("error", (e) => {
      this.$message.error("复制失败");
    });
    utils.setupPasteUpload(this.handleUpload);
  },
  beforeDestroy() {
    this.$clipboard.destroy();
  },
};
</script>

<style scoped>
</style>