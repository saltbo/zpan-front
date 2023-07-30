<template>
  <div class="uploader">
    <div style="display: flex; justify-content: space-between">
      <h5>{{ title }}</h5>
      <file-upload ref="upload" v-model="files" :multiple="true" :maximum="50" @input-filter="inputFilter" @input-file="inputFile"> </file-upload>
    </div>
    <el-table :data="files" size="mini" :show-header="false" empty-text="暂无上传任务" style="width: 100%">
      <el-table-column prop="icon" width="50">
        <template slot-scope="scope">
          <i :class="`iconfont matter-icon ${type2icon(scope.row.type)}`"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
          <el-progress :percentage="Number(scope.row.progress)" v-show="scope.row.progress != 100" :stroke-width="3" :show-text="false"></el-progress>
          <div style="font-size: 12px;">
            <span class="size">{{ fomatSize(scope.row.size) }}</span>
            <span class="speed" v-show="scope.row.progress != 100">{{ fomatSize(scope.row.speed) }}/s</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="op" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.progress == 100" type="primary" size="mini" icon="el-icon-folder" circle plain @click="onFolderClick(scope.row.matter)"></el-button>
          <el-button v-if="scope.row.progress != 100" type="primary" size="mini" icon="el-icon-close" circle plain @click="$refs.upload.remove(scope.row)"></el-button>

          <!-- todo 暂停和继续需要依赖分片上传，先不支持，后续迭代 -->
          <!-- <el-button v-if="scope.row.progress != 100 && uploading" type="primary" size="mini" icon="el-icon-video-pause" circle plain @click="$refs.upload.active = false"></el-button> -->
          <!-- <el-button v-if="scope.row.progress != 100 && !uploading" type="primary" size="mini" icon="el-icon-video-play" circle plain @click="$refs.upload.active = true"></el-button> -->
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
      sid: 0,
      dist: "",
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
    type2icon(type) {
      console.log(type);
      let [t1, t2] = type.split("/");
      let mt = ["pdf", "html", "xml", "psd", "rtf"];
      if (mt.includes(t2)) {
        return `icon-${t2}`;
      }

      let codeTypes = ["json", "yaml", "x-yaml"];
      if (codeTypes.includes(t2)) {
        return "icon-html";
      }

      let compressedFileTypes = ["zip", "x-gzip"];
      if (compressedFileTypes.includes(t2)) {
        return "icon-compressed-file";
      }

      // if (this.isOfficeFile(type)) {
      //   return this.officeIcon(type);
      // }

      let gt = ["audio", "video", "image", "text"];
      if (gt.includes(t1)) {
        return `icon-${t1}`;
      }

      return "icon-file";
    },
    fomatSize(v) {
      return utils.formatBytes(v, 1);
    },
    onFolderClick(matter) {
      this.$router.push({ name: "disk", params: this.$route.params, query: { dir: matter.parent } });
    },
    uploadSelect(obj) {
      this.sid = obj.sid;
      this.dist = obj.dist;
      console.log(obj);
      if (!this.$refs.upload.features.directory) {
        this.alert("Your browser does not support");
        return;
      }

      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("style", "display: none");
      input.setAttribute("multiple", true);
      if (obj.type == "folder") {
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
          this.$zpan.File.uploadDone(oldFile.matter.alias).then((ret) => {
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
          this.$zpan.File.createFile(this.sid, this.dist, newFile).then((ret) => {
            newFile.putAction = ret.data.uplink;
            newFile.headers = ret.data.headers;
            newFile.matter = ret.data.matter;
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

  .matter-icon
    font-size: 35px;
    padding-left: 5px;
</style>