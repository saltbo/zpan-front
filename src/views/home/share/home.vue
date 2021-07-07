<template>
  <div style="margin: 20px 50px">
    <!-- for folder -->
    <el-card v-if="matter.dirtype" class="folder-card" shadow="never" body-style="height: 100%">
      <div slot="header" class="header clearfix">
        <div>
          <span class="name">{{ matter.name }}</span>
          <div style="float: right">
            <el-button type="primary" size="medium" icon="el-icon-download">下载</el-button>
          </div>
        </div>
        <p class="time">
          <i class="el-icon-time"></i>
          <span>{{ matter.created | moment("YYYY-MM-DD HH:hh") }}</span>
          <span>失效时间：{{ expireTime }}</span>
        </p>
      </div>

      <FileExplorer ref="fexp" style="height: calc(100% - 80px)" :dataLoader="dataLoader" :linkLoader="linkLoader" :rowButtons="rowButtons" :rootDir="rootDir" />
    </el-card>

    <!-- for file -->
    <el-card v-else-if="info.id" class="file-card" shadow="never">
      <div slot="header" class="header clearfix">
        <div>
          <span class="name">{{ matter.name }}</span>
          <div style="float: right">
            <el-button type="primary" size="medium" icon="el-icon-download" @click="openDownload(matter)">下载</el-button>
          </div>
        </div>
        <p class="time">
          <i class="el-icon-time"></i>
          <span>{{ matter.created | moment("YYYY-MM-DD HH:hh") }}</span>
          <span>失效时间：{{ expireTime }}</span>
        </p>
      </div>

      <div class="content">
        <div>
          <i class="el-icon-document"></i>
          <p>文件大小：{{ matter.size }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import utils from "@/libs/utils.js";
export default {
  data() {
    return {
      rowButtons: [{ name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype }],

      info: {},
      matter: {},
    };
  },
  computed: {
    layout() {
      if (!this.info.type) {
        return "folder";
      }

      return "file";
    },
    rootDir() {
      return `${this.matter.parent}${this.matter.name}/`; // 以分享的文件夹为根路径
    },
    expireTime() {
      if (this.info.expire_at) {
        return this.info.expire_at.moment();
      }
    },
  },
  methods: {
    dataLoader(dir) {
      return new Promise((resolve, reject) => {
        if (!this.info.id || this.info.type) {
          return;
        }

        let alias = this.$route.params.alias;
        this.$zpan.Share.listMatters(alias, { dir: dir }).then((ret) => {
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
        this.$zpan.File.findLink(obj.alias)
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
    listRefresh(alias) {
      this.$zpan.Share.findMatter(alias).then((ret) => {
        this.matter = ret.data;
        this.matter.size = utils.formatBytes(this.matter.size, 1);

        if (this.$refs.fexp) {
          this.$refs.fexp.listRefresh();
        }
      });
    },
  },
  watch: {
    $route(nv) {
      this.listRefresh(nv.params.alias);
    },
  },
  mounted() {
    let alias = this.$route.params.alias;
    this.$zpan.Share.find(alias).then((ret) => {
      let info = ret.data;
      if (info.protected && localStorage.getItem("zpan-share") != alias) {
        this.$router.push({ name: "share-draw" });
        return;
      }

      this.info = info;
      this.listRefresh(alias);
      document.title = `${info.name} | Zpan`;
    });
  },
};
</script>

<style scoped>
.file-card {
  width: 800px;
  margin: 0 auto;
  height: 600px;
}
.folder-card {
  min-width: 800px;
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100% - 120px);
}

.header .name {
  font-size: 22px;
  font-weight: bold;
}

.header .time {
  font-size: 12px;
  margin: 10px 0;
}
.time i {
  width: 18px;
}
.time span {
  margin-right: 20px;
}

.content {
  background: #f6f9fd;
  height: 600px;
  text-align: center;
  padding-top: 120px;
}
.content i {
  font-size: 90px;
}
.content p {
  margin-top: 30px;
}
</style>