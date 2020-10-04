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
    <link rel="stylesheet" href="//at.alicdn.com/t/font_2113109_1je0tpphnvr.css">
    <el-row class="toolbar">
      <el-button type="primary" size="medium" icon="el-icon-upload" @click="$refs.uploader.open()">{{ $t("disk.upload") }}</el-button>
      <el-button v-show="folderBtnShown" type="primary" size="medium" icon="el-icon-folder-add" @click="openCreateDiglog" plain>{{ $t("disk.folder") }}</el-button>
      <el-button-group v-show="selectedItems.length > 0" style="margin-left: 10px">
        <el-button type="primary" icon="el-icon-download" size="medium" plain @click="$refs.outlink.open(selectedItems)">{{ $t("disk.download") }}</el-button>
        <!-- <el-button type="primary" icon="el-icon-share" size="medium" @click="share" plain>分享</el-button> -->
        <el-button type="primary" icon="el-icon-delete" size="medium" plain @click="deleteSelection">{{ $t("disk.delete") }}</el-button>
        <!-- <el-button type="primary" size="medium" plain>移动到</el-button> -->
      </el-button-group>

      <div style="float: right">
        <el-input class="search" size="small" :placeholder="$t('topbar.search')" v-model="query.kw" @keyup.enter.native="listRefresh">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <i v-if="layout=='list'" class="iconfont icon-grid" @click="layout='grid'"></i>
        <i v-else class="iconfont icon-list" @click="layout='list'"></i>
      </div>
    </el-row>

    <!-- main -->
    <FileExplorer :layout="layout" ref="fexp" style="height: calc(100% - 67px)" :dataLoader="dataLoader" :linkLoader="linkLoader" :rowButtons="rowButtons" :moreButtons="moreButtons" @selection-change="onSelectionChange" />

    <!-- dialog -->
    <DialogMove ref="move" @completed="listRefresh"></DialogMove>
    <DialogShare ref="share"></DialogShare>
    <DialogUpload ref="uploader" :dest-dir="query.dir" @completed="listRefresh"></DialogUpload>
    <DialogOutlink ref="outlink"></DialogOutlink>
  </div>
</template>

<script>
// @ is an alias to /src
import { zfile, zfolder } from "@/libs/zpan";
import DialogMove from "./components/DialogMove";
import DialogShare from "./components/DialogShare";
import DialogUpload from "./components/DialogUpload";
import DialogOutlink from "./components/DialogOutlink";
export default {
  name: "home",
  components: {
    DialogMove,
    DialogShare,
    DialogUpload,
    DialogOutlink,
  },
  data() {
    return {
      query: {
        dir: ""
      },
      layout: 'list',
      folderBtnShown: false,
      rowButtons: [
        { name: "download", icon: "el-icon-download", action: this.openDownload, shown: (item) => !item.dirtype },
        { name: "share", icon: "el-icon-share", action: this.share },
      ],
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
      this.query.type = newVal.query.type;  // doc,image,audio,vedio
      this.folderBtnShown = !this.query.type;
    },
  },
  methods: {
    dataLoader(dir, offset, limit) {
      if (dir != this.query.dir) {
        this.query.dir = dir;
      }

      this.query.offset = offset ? offset : 0;
      this.query.limit = limit ? limit : 10
      return zfile.listObjects(this.query);
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
        let body = { name: value, dir: this.query.dir };
        zfolder.create(body).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.create-success"),
          });
          this.listRefresh();
        });
      });
    },
    share(obj) {
      this.$refs.share.open(obj.alias);
    },
    move(obj) {
      this.$refs.move.open(obj);
    },
    rename(obj) {
      this.$prompt(this.$t("tips.rename"), this.$t("rename"), {
        inputValue: obj.name,
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(({ value }) => {
        let rename = obj.dirtype > 0 ? zfolder.rename : zfile.rename;
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
        let remove = obj.dirtype ? zfolder.delete : zfile.delete;
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
          text: this.$t("loading.deleting"),
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
