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
      <el-dropdown size="small" style="margin-right: 10px" @command="onUploadSelect">
        <el-button type="primary" size="small" icon="el-icon-upload" @click="onUploadSelect('file')">上传</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="file">上传文件</el-dropdown-item>
          <el-dropdown-item command="folder">上传文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown size="small" @command="onCreationSelect">
        <el-button type="primary" size="small" icon="el-icon-folder-add"  @click="openCreateFolderDiglog" plain>新建</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="file">新建文件</el-dropdown-item>
          <el-dropdown-item command="folder">新建文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button-group v-show="selectedItems.length > 0" style="margin-left: 10px">
        <el-button type="primary" icon="el-icon-download" size="medium" plain @click="onOutlinkClick">{{ $t("disk.download") }}</el-button>
        <!-- <el-button type="primary" icon="el-icon-share" size="medium" @click="share" plain>分享</el-button> -->
        <el-button type="primary" icon="el-icon-delete" size="medium" plain @click="deleteSelection">{{ $t("disk.delete") }}</el-button>
        <!-- <el-button type="primary" size="medium" plain>移动到</el-button> -->
      </el-button-group>

      <div style="float: right">
        <el-input class="search" size="small" :placeholder="$t('topbar.search')" v-model="query.kw" @keyup.enter.native="listRefresh">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <i v-if="layout == 'list'" class="iconfont icon-grid" @click="layout = 'grid'"></i>
        <i v-else class="iconfont icon-list" @click="layout = 'list'"></i>
      </div>
    </el-row>

    <!-- main -->
    <FileExplorer :layout="layout" ref="fexp" :dataLoader="dataLoader" :linkLoader="linkLoader" :rowButtons="rowButtons" :moreButtons="moreButtons" @file-open="onFileOpen" @selection-change="onSelectionChange" />

    <!-- dialog -->
    <!-- <DialogMove ref="move" @completed="listRefresh"></DialogMove>
    <DialogShare ref="share"></DialogShare>
    <DialogUpload ref="uploader" :sid="getSid()" :dest-dir="query.dir" @completed="listRefresh"></DialogUpload>
    <DialogOutlink ref="outlink"></DialogOutlink> -->
  </div>
</template>

<script>
// @ is an alias to /src
import { transfer } from "@/helper";
import FileViewer from "@/components/FileViewer";
import DialogMove from "./components/DialogMove";
import DialogShare from "./components/DialogShare";
import DialogUpload from "./components/DialogUpload";
import DialogOutlink from "./components/DialogOutlink";
import { CSMixin } from "@/libs/mixin";
export default {
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
    openDownload(obj) {
      this.linkLoader(obj).then((link) => {
        let a = document.createElement("a");
        a.setAttribute("href", link);
        a.setAttribute("download", obj.name);
        a.click();
        a.remove();
      });
    },
    openCreateFolderDiglog() {
      this.$prompt(this.$t("tips.create-folder"), this.$t("op.create-folder"), {
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(({ value }) => {
        this.$zpan.File.createFolder(this.getSid(), value, this.query.dir).then((ret) => {
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
            file: new File([""], value, {type: "text/plain"}),
            filename: value
          }

          this.$zpan.File.upload(this.getSid(), fileObj).then((data) => {
            window.open(`f/editor?alias=${data.alias}`, "_blank")
          });
      });
    },
    onUploadSelect(cmd) {
      this.$emit("upload-action", { type: cmd, sid: this.getSid(), dist: this.query.dir });
    },
    onCreationSelect(cmd){
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
    onFileOpen(type, obj, link) {
      if (obj.type.startsWith("audio")) {
        this.$emit("audio-open", obj, link);
        return;
      }

      new FileViewer().view(type, obj, link);
    },
    onOutlinkClick() {
      transfer(DialogOutlink)({ items: this.selectedItems });
    },
    share(obj) {
      transfer(DialogShare)({ alias: obj.alias });
    },
    viewlink(obj) {
      this.linkLoader(obj).then((link) => {
        const h = this.$createElement;
        this.$msgbox({
          title: "获取外链",
          message: h("p", null, link),
          confirmButtonText: "确定",
        });
      });
    },
    move(obj) {
      transfer(DialogMove)({ alias: obj.alias, isDir: obj.dirtype > 0 }).then(() => {
        this.listRefresh();
      });
    },
    rename(obj) {
      this.$prompt(this.$t("tips.rename"), this.$t("op.rename"), {
        inputValue: obj.name,
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(({ value }) => {
        this.$zpan.File.rename(obj.alias, value).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.rename-success"),
          });
          this.listRefresh();
        });
      });
    },
    remove(obj) {
      this.$confirm(this.$t("tips.remove"), this.$t("op.delete") + ` ${obj.name}`, {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        this.$zpan.File.delete(obj.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.delete-success"),
          });
          this.listRefresh();
        });
      });
    },
    onSelectionChange(selection) {
      this.selectedItems = selection;
    },
    deleteSelection() {
      this.$confirm(this.$t("tips.batch-delete"), this.$t("op.batch-delete"), {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t("tips.deleting"),
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        Promise.all(
          this.selectedItems.map((obj) => {
            return this.$zpan.File.delete(obj.alias);
          })
        )
          .then((ret) => {
            this.listRefresh();
            loading.close();
            this.$message({
              type: "success",
              message: this.$t("msg.batch-delete-success"),
            });
          })
          .catch((err) => {
            loading.close();
            console.log(err);
          });
      });
    },
  },
  mounted() {
    this.query.type = this.$route.query.type;
    this.folderBtnShown = !this.query.type;
  },
};
</script>
