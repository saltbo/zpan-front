<template>
  <div>
    <el-upload action list-type="picture-card" :http-request="handleUpload" :accept="acceptImgs" :file-list="fileList" :on-preview="showPicPreview" :before-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- preview dialog -->
    <el-dialog :visible.sync="dialog.show" :title="dialog.title" center>
      <img width="100%" :src="dialog.imgUrl" alt />

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="copy-link" :data-clipboard-text="dialog.imgUrl" @click="dialog.show = false">{{ $t("copy-link") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/libs/utils.js";
import { CSMixin } from "@/libs/mixin";
export default {
  mixins: [CSMixin],
  data() {
    return {
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
    getLink(alias) {
      return new Promise((resolve, reject) => {
        this.$zpan.File.findLink(alias).then((ret) => {
          resolve(ret.link);
        });
      });
    },
    listRefresh() {
      this.$zpan.File.listObjects({ sid: this.getSid(), type: "image" }).then((data) => {
        this.fileList = data.list.map((obj) => {
          return { alias: obj.alias, name: obj.name, url: obj.url };
        });
        this.fileList.forEach((ele) => {
          this.getLink(ele.alias).then((link) => {
            ele.url = link;
          });
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

      this.$zpan.File.upload(this.getSid(), fileObj)
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
      return this.$confirm(this.$t("tips.remove"), this.$t("delete") + ` ${file.name}`, {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        this.$zpan.File.delete(file.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.delete-success"),
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
    utils.setupPasteUpload(this.handleUpload);
  },
};
</script>

<style scoped>
</style>