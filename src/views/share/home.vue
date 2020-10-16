<template>
  <div style="margin: 20px 50px">
    <!-- for private file -->
    <el-card v-show="layout == 'draw'" class="box-card" style="width: 500px; margin: 100px auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item :label="$t('share.drawcode')">
          <el-input v-model="drawcode" :placeholder="$t('share.drawcode-placeholder')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="draw(info.alias)">{{ $t("share.drawfile") }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- for file -->
    <div v-show="layout == 'file'" style="width: 800px; margin: 0 auto">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ matter.name }}</span>
        </div>
        <div class="text item">
          <a :href="fileURL">{{ $t("share.auto-download-tips") }}</a>
        </div>
      </el-card>
    </div>

    <!-- for folder -->
    <el-card v-show="layout == 'folder'" class="box-card" style="width: 1500px; margin: auto 10px">
      <div slot="header" class="clearfix">
        <span>{{ matter.name }}</span>
        <p>{{ matter.created | moment }}</p>
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

      fileURL: "",
      info: {},
      protected: false,
      drawcode: "",
      matter: {},
    };
  },
  computed: {
    shouldDraw() {
      return this.protected && !localStorage.getItem(`zs-${this.info.alias}`);
    },
    layout() {
      if (this.shouldDraw) {
        return "draw";
      }

      if (!this.info.type) {
        return "folder";
      }

      return "file";
    },
    rootDir() {
      return `${this.matter.parent}${this.matter.name}/`; // 以分享的文件夹为根路径
    },
  },
  watch: {
    matter(nv) {
      if (nv.type) {
        this.autoDownload(nv.alias);
      }
    },
  },
  methods: {
    dataLoader(dir) {
      return new Promise((resolve, reject) => {
        if (!this.info.id || this.info.type || this.shouldDraw) {
          return;
        }

        let alias = this.$route.params.alias;
        zShare.listMatters(alias, { dir: dir }).then((ret) => {
          let data = ret.data;
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
    autoDownload(alias) {
      zfile.download(alias).then((ret) => {
        this.fileURL = ret.link;
      });
    },
    draw(alias) {
      zShare.draw(alias, this.drawcode).then((ret) => {
        this.protected = false;
        localStorage.setItem(`zs-${alias}`, 1);
        this.listRefresh(alias);
      });
    },
    listRefresh(alias) {
      zShare.findMatter(alias).then((ret) => {
        this.matter = ret.data;
      });

      if (!this.info.type) {
        this.$refs.fexp.listRefresh();
      }
    },
  },
  mounted() {
    let alias = this.$route.params.alias;
    zShare.find(alias).then((ret) => {
      this.info = ret.data;
      this.protected = ret.data.protected;
      if (this.shouldDraw) {
        return;
      }

      this.listRefresh(alias);
    });
  },
};
</script>

<style scoped>
</style>