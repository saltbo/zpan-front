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
  <div style="height: 100%">
    <el-row class="toolbar">
      <el-button type="primary" size="medium" icon="el-icon-upload" @click="onUploadClick">{{ $t("disk.upload") }}</el-button>
      <el-button v-show="folderBtnShown" type="primary" size="medium" icon="el-icon-folder-add" @click="openCreateDiglog" plain>{{ $t("disk.folder") }}</el-button>
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
    <FileExplorer :layout="layout" ref="fexp" style="height: calc(100% - 67px)" :dataLoader="dataLoader" :linkLoader="linkLoader" :rowButtons="rowButtons" :moreButtons="moreButtons" @selection-change="onSelectionChange" />

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
import DialogMove from "./components/DialogMove";
import DialogShare from "./components/DialogShare";
import DialogUpload from "./components/DialogUpload";
import DialogOutlink from "./components/DialogOutlink";
import Mixin from "../mixin";
export default {
  name: "home",
  mixins: [Mixin],
  data() {
    return {
      query: {
        kw: "",
        dir: "",
      },
      layout: "list",
      folderBtnShown: false,
      // rowButtons: [
      //   { name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype },
      //   { name: "share", icon: "el-icon-share", action: this.share },
      // ],
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
        this.$zpan.File.listObjects(this.query).then((ret) => {
          this.query.kw = "";
          resolve(ret);
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
    listRefresh() {
      this.$refs.fexp.listRefresh();
    },
    openDownload(obj) {
      this.linkLoader(obj).then((link) => {
        var a = document.createElement("a");
        a.href = link;
        a.download = obj.name;
        a.click();
      });
    },
    openCreateDiglog() {
      this.$prompt(this.$t("tips.create-folder"), this.$t("create-folder"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(({ value }) => {
        let body = { sid: this.getSid(), name: value, dir: this.query.dir };
        this.$zpan.Folder.create(body).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.create-success"),
          });
          this.listRefresh();
        });
      });
    },
    onUploadClick() {
      transfer(DialogUpload)({ sid: this.getSid(), destDir: this.query.dir }).then(() => {
        this.listRefresh();
      });
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
      this.$prompt(this.$t("tips.rename"), this.$t("rename"), {
        inputValue: obj.name,
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(({ value }) => {
        let rename = obj.dirtype > 0 ? this.$zpan.Folder.rename : this.$zpan.File.rename;
        rename(obj.alias, value).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.rename-success"),
          });
          this.listRefresh();
        });
      });
    },
    remove(obj) {
      this.$confirm(this.$t("tips.remove"), this.$t("delete") + ` ${obj.name}`, {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        let remove = obj.dirtype ? this.$zpan.Folder.delete : this.$zpan.File.delete;
        remove(obj.alias).then((ret) => {
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
      this.$confirm(this.$t("tips.batch-delete"), this.$t("batch-delete"), {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: this.$t("tips.deleting"),
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });

        Promise.all(
          this.selectedItems.map((obj) => {
            return zfile.delete(obj.alias);
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
