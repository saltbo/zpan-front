<template>
  <div style="margin: 20px 50px;">
    <!-- for file -->
    <div v-show="file.dirtype==0" style="width: 800px; margin: 0 auto">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{file.name}}</span>
        </div>
        <div class="text item">
          <a :href="fileURL">您的文件已经开始下载，如果没有开始请单击此处重试</a>
        </div>
      </el-card>
    </div>

    <!-- for private file -->
    <el-card v-show="private" class="box-card" style="width: 500px; margin: 100px auto;">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="提取码">
          <el-input v-model="drawcode" placeholder="请输入提取码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="draw">提取文件</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- for folder -->
    <el-card v-show="file.dirtype" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{file.name}}</span>
        <p>{{file.created | moment}}</p>
      </div>

      <div>
        <FileTable v-model="tableData" :current="currentDir" @folder-open="openFolder" :urlget="urlGet"></FileTable>
      </div>
    </el-card>
  </div>
</template>

<script>
import utils from "@/libs/utils.js";
import FileTable from "@/components/FileTable";
export default {
  components: {
    FileTable,
  },
  data() {
    return {
      file: {},
      fileURL: "",
      rootDir: "",
      currentDir: "",
      tableData: [],
      private: false,
      drawcode: "",
    };
  },
  watch: {
    $route: "onRouteChange",
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      this.currentDir = "";
      if (newVal.query.path) {
        this.currentDir = newVal.query.path;
      }

      this.listRefresh(this.alias);
    },
    openFolder(fullPath) {
      this.currentDir = fullPath.replace(this.rootDir, ""); // 隐藏根路径
      this.$router.push({ query: { path: this.currentDir } });
    },
    urlGet(obj) {
      return new Promise((resolve, reject) => {
        utils
          .downloadURL(obj.alias)
          .then((ret) => {
            resolve(ret.link);
          })
          .catch(reject);
      });
    },
    autoDownload() {
      utils.downloadURL(this.file.alias).then((ret) => {
        utils.download(this.file.name, ret.link);
        this.fileURL = ret.link;
      });
    },
    draw() {
      localStorage.setItem("zpan-secret-" + this.alias, this.drawcode);
      this.listRefresh(this.alias);
    },
    listRefresh(alias) {
      let path = this.$route.query.path ? this.$route.query.path : "";
      let query = { params: { secret: this.drawcode, dir: this.currentDir } };
      this.$axios
        .get(`/api/shares/${alias}`, query)
        .then((ret) => {
          this.private = false;
          this.file = ret.data.data.matter;
          if (this.file.dirtype == 0) {
            this.autoDownload(this.file.alias);
            return;
          }

          this.rootDir = `${this.file.parent}${this.file.name}/`; // 以分享的文件夹为根路径
          this.currentDir = path; //以query中的path作为当前路径
          this.tableData = ret.data.data.list.map((item) => {
            item.size = utils.formatBytes(item.size, 1);
            item.fullpath = `${item.parent}${item.name}`;
            if (item.dirtype) item.fullpath += "/";
            return item;
          });
        })
        .catch((err) => {
          console.log(err.response);
          if (!this.file.name) {
            this.private = true;
            return;
          }
        });
    },
  },
  mounted() {
    this.alias = this.$route.params.alias;
    this.currentDir = this.$route.query.path;
    this.drawcode = localStorage.getItem("zpan-secret-" + this.alias);
    this.listRefresh(this.alias);
  },
};
</script>

<style scoped>
</style>