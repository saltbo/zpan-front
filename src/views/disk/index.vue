<style scoped>
.menu {
  margin-bottom: 20px;
}
</style>

<template>
  <div>
    <el-row class="menu">
      <el-button type="primary" size="medium" icon="el-icon-upload" @click="$refs.uploader.open()">{{ $t('disk.upload') }}</el-button>
      <el-button v-show="!query.type" type="primary" size="medium" icon="el-icon-folder-add" @click="openCreateDiglog" plain>{{ $t('disk.folder') }}</el-button>
      <el-button-group v-show="selectedItems.length>0" style="margin-left: 10px;">
        <el-button type="primary" icon="el-icon-download" size="medium" plain @click="$refs.outlink.open(selectedItems);">{{ $t('disk.download') }}</el-button>
        <!-- <el-button type="primary" icon="el-icon-share" size="medium" @click="share" plain>分享</el-button> -->
        <el-button type="primary" icon="el-icon-delete" size="medium" plain @click="deleteSelection">{{ $t('disk.delete') }}</el-button>
        <!-- <el-button type="primary" size="medium" plain>移动到</el-button> -->
      </el-button-group>
    </el-row>

    <!-- main -->
    <FileTable v-model="tableData" :selection.sync="selectedItems" :loading="loading" :current="query.dir" :urlget="urlGet" @folder-open="openFolder" @on-share="obj=>{$refs.share.open(obj.alias)}" @on-move="obj=>{$refs.move.open(obj)}" @on-rename="raname" @on-remove="remove" show-share show-more></FileTable>

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
import FileTable from "@/components/FileTable";
import DialogMove from "./components/DialogMove";
import DialogShare from "./components/DialogShare";
import DialogUpload from "./components/DialogUpload";
import DialogOutlink from "./components/DialogOutlink";
export default {
  name: "home",
  components: {
    FileTable,
    DialogMove,
    DialogShare,
    DialogUpload,
    DialogOutlink,
  },
  data() {
    return {
      query: {},
      tableData: [],
      loading: false,
      selectedItems: [],
    };
  },
  watch: {
    $route: "onRouteChange",
    uploadShow() {
      this.fileList = [];
    },
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      this.query = newVal.query;
      this.listRefresh();
    },
    listRefresh() {
      this.loading = true;
      zfile.listObjects(this.query).then((objects) => {
        this.tableData = objects;
        this.loading = false;
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
    openFolder(dir) {
      this.$router.push({ query: { dir: dir } });
    },
    urlGet(obj) {
      return new Promise((resolve, reject) => {
        zfile
          .findLink(obj.alias)
          .then((ret) => {
            resolve(ret.link);
          })
          .catch(reject);
      });
    },
    raname(obj) {
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
      if (obj.dirtype) {
        this.$message("暂不支持删除文件夹");
        return;
      }

      this.$confirm(
        this.$t("tips.remove"),
        this.$t("delete") + ` ${obj.name}`,
        {
          type: "warning",
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
        }
      ).then(() => {
        zfile.delete(obj.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.delete-success"),
          });
          this.listRefresh();
        });
      });
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
    this.query = this.$route.query;
    this.listRefresh();
  },
};
</script>
