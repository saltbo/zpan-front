<template>
  <div style="margin: 20px 50px">
    <!-- for file -->
    <div v-show="file.dirtype == 0" style="width: 800px; margin: 0 auto">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ file.name }}</span>
        </div>
        <div class="text item">
          <a :href="fileURL">{{ $t("share.auto-download-tips") }}</a>
        </div>
      </el-card>
    </div>

    <!-- for private file -->
    <el-card v-show="drawshow" class="box-card" style="width: 500px; margin: 100px auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item :label="$t('share.drawcode')">
          <el-input v-model="drawcode" :placeholder="$t('share.drawcode-placeholder')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="draw">{{ $t("share.drawfile") }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- for folder -->
    <el-card v-show="file.dirtype" class="box-card" style="width: 1500px; margin: auto 10px">
      <div slot="header" class="clearfix">
        <span>{{ file.name }}</span>
        <p>{{ file.created | moment }}</p>
      </div>

      <FileExplorer ref="fexp" :dataLoader="dataLoader" :linkLoader="linkLoader" :rowButtons="rowButtons" :rootDir="rootDir" />
    </el-card>
  </div>
</template>

<script>
import { zfile, zShare } from "@/libs/zpan";
import utils from "@/libs/utils.js";
export default {
  data() {
    return {
      rowButtons: [{ name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype }],

      file: {},
      fileURL: "",
      rootDir: "",
      currentDir: "",
      tableData: [],
      drawshow: false,
      drawcode: "",
    };
  },
  methods: {
    dataLoader(dir) {
      return new Promise((resolve, reject) => {
        let alias = this.$route.params.alias;
        let query = { secret: this.drawcode, dir: dir };

        zShare.find(alias, query).then((ret) => {
          let data = ret.data;
          this.file = data.matter;
          if (this.file.dirtype == 0) {
            this.autoDownload(this.file.alias);
            return;
          }

          this.rootDir = `${this.file.parent}${this.file.name}/`; // 以分享的文件夹为根路径
          data.list = data.list.map((item) => {
            item.size = utils.formatBytes(item.size, 1);
            item.fullpath = `${item.parent}${item.name}`;
            if (item.dirtype) item.fullpath += "/";
            return item;
          });
          resolve(data);
        });
      });
    },
    linkLoader(obj) {
      return new Promise((resolve, reject) => {
        zfile
          .findLink(obj.alias)
          .then((ret) => {
            resolve(ret.link);
          })
          .catch(reject);
      });
    },
    openDownload(obj) {
      this.linkLoader(obj).then((link) => {
        var a = document.createElement("a");
        a.href = link;
        a.download = obj.name;
        a.click();
      });
    },
    autoDownload() {
      zfile.download(this.file.alias).then((ret) => {
        this.fileURL = ret.link;
      });
    },
    listRefresh(alias) {
      this.$refs.fexp.listRefresh();
    },
    draw() {
      localStorage.setItem("zpan-secret-" + this.alias, this.drawcode);
      this.listRefresh();
    },
  },
  mounted() {
    this.alias = this.$route.params.alias;
    this.drawcode = localStorage.getItem("zpan-secret-" + this.alias);
    this.listRefresh();
  },
};
</script>

<style scoped>
</style>