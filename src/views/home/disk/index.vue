<style scoped>
.toolbar {
  height: 45px;
  border-bottom: 1px solid #f2f6fd;
  margin-bottom: 5px;
}

.search {
  width: 200px;
}

.iconfont {
  font-size: 30px;
  vertical-align: middle;
}
</style>

<template>
  <div style="height: calc(100% - 58px)">
    <el-row class="toolbar">
      <zp-uploader ref="uploader" class="btn btn-primary" :sid="getSid()" :dist="query.dir" @uploaded="listRefresh()">
      </zp-uploader>
      <el-button type="primary" size="small" icon="el-icon-upload" style="margin-right: 10px"
        @click="$refs.uploader.upload()">上传</el-button>
      <el-dropdown size="small" @command="onCreationSelect">
        <el-button type="primary" size="small" icon="el-icon-folder-add" @click="openCreateFolderDiglog" plain>新建
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="file">新建文件</el-dropdown-item>
          <el-dropdown-item command="folder">新建文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button-group v-show="selectedItems.length > 0" style="margin-left: 10px">
        <el-button type="primary" icon="el-icon-download" size="small" plain @click="onDownload">{{ $t("disk.download")
        }}</el-button>
        <!-- <el-button type="primary" icon="el-icon-share" size="small" @click="share" plain>分享</el-button> -->
        <el-button type="primary" icon="el-icon-delete" size="small" plain @click="onDelete">{{ $t("disk.delete") }}
        </el-button>
        <el-button type="primary" icon="el-icon-move" size="small" plain @click="onMove">移动到</el-button>
      </el-button-group>

      <div style="float: right">
        <el-input class="search" size="small" :placeholder="$t('topbar.search')" v-model="query.kw"
          @keyup.enter.native="listRefresh">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <i v-if="layout == 'list'" class="iconfont icon-grid" @click="layout = 'grid'"></i>
        <i v-else class="iconfont icon-list" @click="layout = 'list'"></i>
      </div>
    </el-row>

    <!-- main -->
    <FileExplorer ref="fexp" :layout="layout" :dataLoader="dataLoader" :linkLoader="linkLoader"
      :action-move="$zpan.File.move" :action-copy="$zpan.File.copy" :action-rename="$zpan.File.rename"
      :action-remove="$zpan.File.delete" @file-action="onFileAction" @selection-change="onSelectionChange" />
  </div>
</template>

<script>
// @ is an alias to /src
import ZpUploader from "@/components/Uploader";
import { CSMixin } from "@/libs/mixin";
export default {
  name: 'disk',
  components: {
    ZpUploader
  },
  mixins: [CSMixin],
  data() {
    return {
      query: {
        kw: "",
        dir: "",
      },
      layout: "list",
      folderBtnShown: false,
      moreButtons: [
        { name: "move", title: this.$t("ftb.move"), action: this.move },
        { name: "rename", title: this.$t("ftb.rename"), action: this.rename },
        { name: "remove", title: this.$t("ftb.remove"), action: this.remove },
      ],
      selectedItems: [],
    };
  },
  watch: {
    $route(newVal, oldVal) {
      this.query.type = newVal.query.type; // doc,image,audio,vedio
      this.folderBtnShown = !this.query.type;
    },
  },
  computed: {
    rowButtons() {
      if (this.cs.mode == 1) {
        return [
          { name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype },
          { name: "share", icon: "el-icon-share", action: this.share },
        ];
      }

      return [
        { name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype },
        { name: "viewlink", icon: "el-icon-view", action: this.viewlink },
      ];
    },
  },
  methods: {
    dataLoader(dir, offset, limit) {
      if (dir != this.query.dir) {
        this.query.dir = dir;
      }

      this.query.sid = this.getSid();
      this.query.offset = offset ? offset : 0;
      this.query.limit = limit ? limit : 10;
      return new Promise((resolve, reject) => {
        this.$zpan.File.list(this.query).then((ret) => {
          this.query.kw = "";
          resolve(ret);
        });
      });
    },
    linkLoader(obj) {
      return new Promise((resolve, reject) => {
        this.$zpan.File.get(obj.alias)
          .then((ret) => {
            resolve(ret.url);
          })
          .catch(reject);
      });
    },
    listRefresh() {
      this.$refs.fexp.listRefresh();
    },
    onCreationSelect(cmd) {
      switch (cmd) {
        case 'file':
          this.openCreateFileDiglog()
          break;
        case 'folder':
          this.openCreateFolderDiglog()
          break;
        default:
          break;
      }
    },
    openCreateFolderDiglog() {
      this.$prompt(this.$t("tips.create-folder"), this.$t("op.create-folder"), {
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(({ value }) => {
        let body = { sid: this.getSid(), name: value, dir: this.query.dir, is_dir: true };
        this.$zpan.File.create(body).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.create-success"),
          });
          this.listRefresh();
        });
      });
    },
    openCreateFileDiglog() {
      var filename
      var fileext = '.md'
      var message = <el-input placeholder="请输入内容" v-model={filename} class="input-with-select">
        <el-select v-model={fileext} slot="append" placeholder="请选择" style="width: 70px">
          <el-option label=".txt" value=".txt"></el-option>
          <el-option label=".md" value=".md"></el-option>
        </el-select>
      </el-input>
      this.$msgbox({
        title: this.$t("op.create-file"),
        message: message,
        showCancelButton: true,
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(({ value }) => {
        let fileObj = {
          file: new File([""], value, { type: "text/plain" }),
          filename: value
        }

        this.$zpan.File.upload(this.getSid(), fileObj).then((data) => {
          window.open(`f/editor?alias=${data.alias}`, "_blank")
        });
      });
    },
    onFileAction() {

    },
    onSelectionChange(selection) {
      this.selectedItems = selection;
    },
    onDownload() { this.$refs.fexp.download() },
    onMove() { this.$refs.fexp.openMove() },
    onDelete() { this.$refs.fexp.openRemove() }
  },
  mounted() {
    this.query.type = this.$route.query.type;
    this.folderBtnShown = !this.query.type;
  },
};
</script>
