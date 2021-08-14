<template>
  <div class="uploader">
    <div style="display: flex; justify-content: space-between">
      <h5>{{ title }}</h5>
      <file-upload ref="upload" v-model="files" :multiple="true" :maximum="50" @input-filter="inputFilter" @input-file="inputFile"> </file-upload>
    </div>
    <el-table :data="files" size="mini" :show-header="false" empty-text="暂无上传任务" style="width: 100%">
      <el-table-column prop="icon" width="50"> </el-table-column>
      <el-table-column prop="name">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
          <el-progress :percentage="Number(scope.row.progress)" :stroke-width="3" :show-text="false"></el-progress>
          <div style="font-size: 12px">
            <span class="size">{{ fomatSize(scope.row.size) }}</span>
            <span class="speed">{{ fomatSize(scope.row.speed) }}/s</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="op" width="100">
        <template slot-scope="scope">
          <el-button v-show="scope.row.progress == 100" type="primary" size="mini" icon="el-icon-folder" circle plain></el-button>
          <el-button v-show="scope.row.progress != 100 && uploading" type="primary" size="mini" icon="el-icon-video-pause" circle plain></el-button>
          <el-button v-show="scope.row.progress != 100 && !uploading" type="primary" size="mini" icon="el-icon-video-play" circle plain></el-button>
          <el-button v-show="scope.row.progress != 100" type="primary" size="mini" icon="el-icon-close" circle plain @click="$refs.upload.remove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tip">- 仅展示本次上传任务 -</div>
  </div>
</template>

<script>
import FileUpload from "vue-upload-component";
import utils from "@/libs/utils";
export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
      uploading: false,
      uploadedCnt: 0,
    };
  },
  watch: {
    files(nv) {
      this.$emit("utotal-change", nv.length);
    },
  },
  computed: {
    title() {
      let text = this.uploading ? "正在上传" : "上传完成";
      return `${text}（${this.uploadedCnt}/${this.files.length}）`;
    },
  },
  methods: {
    fomatSize(v) {
      return utils.formatBytes(v, 1);
    },
    uploadSelect(type) {
      console.log(type);
      if (!this.$refs.upload.features.directory) {
        this.alert("Your browser does not support");
        return;
      }

      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("style", "display: none");
      input.setAttribute("multiple", true);
      if (type == "folder") {
        input.setAttribute("allowdirs", true);
        input.setAttribute("directory", true);
        input.setAttribute("webkitdirectory", true);
      }
      document.querySelector("body").appendChild(input);
      input.click();
      input.onchange = (e) => {
        this.$refs.upload.addInputFile(input);
        document.querySelector("body").removeChild(input);
      };
    },
    inputFilter(newFile, oldFile, prevent) {},
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 获得相应数据
        console.log("response", newFile.response);
        if (newFile.xhr) {
          //  获得响应状态码
          console.log("status", newFile.xhr.status);
          this.$zpan.File.uploadDone(oldFile.alias).then((ret) => {
            this.uploadedCnt++;
          });
        }
        return;
      }

      if (!newFile && oldFile) {
        // ignore remove event
        return;
      }

      this.$emit("uploadAdded");
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$zpan.File.create(1, "", newFile).then((ret) => {
            newFile.putAction = ret.data.link;
            newFile.headers = ret.data.headers;
            newFile.alias = ret.data.alias;
            this.$refs.upload.active = true;
            this.uploading = true;
          });
        }
      }
    },
  },
  mounted() {
    this.$watch("$refs.upload.uploaded", (uploaded) => {
      this.uploading = !uploaded;
    });
  },
};
</script>

<style lang="stylus">
.uploader
  .size
    color: #878c9c;

  .speed
    color: #06a7ff;
    float: right;

  .tip
    color: #afb3bf;
    margin-top: 10px;
    text-align: center;
</style>