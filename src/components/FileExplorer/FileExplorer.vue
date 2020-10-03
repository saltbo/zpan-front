<template>
  <div>
    <el-row class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.dir" :index="item.dir" :to="buildQuery(item.dir)">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="loadtips" style="float: right">{{ loadedtips }}</span>
    </el-row>

    <!-- explorer -->
    <GridExplorer v-model="rows" :loading="loading" :moreButtons="moreButtons" @on-click="onClick" v-if="layout == 'grid'" />
    <ListExplorer v-model="rows" :loading="loading" :rowButtons="rowButtons" :moreButtons="moreButtons" @on-click="onClick" @scroll-end="onScrollEnd" @selection-change="onSelectionChange" v-else />

    <!-- viewer -->
    <MediaViewer v-model="selected" :visible="mediavv" @close="mediavv = false"></MediaViewer>
    <PictureViewer ref="photoView"></PictureViewer>
  </div>
</template>

<script>
import GridExplorer from "./explorer/GridExplorer";
import ListExplorer from "./explorer/ListExplorer";
import { MediaViewer, PictureViewer } from "../FileViewer";
export default {
  components: {
    GridExplorer,
    ListExplorer,
    MediaViewer,
    PictureViewer,
  },
  props: {
    layout: {
      type: String,
      default: "list",
    },
    dataLoader: Function,
    linkLoader: Function,
    rowButtons: Array,
    moreButtons: Array,
    rootDir: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentDir: "",
      loading: false,
      offset: 0,
      limit: 10,
      rows: [],
      total: 0,
      selection: Array,

      selected: {},
      mediavv: false,
    };
  },
  watch: {
    $route: "onRouteChange",
  },
  computed: {
    breadcrumb() {
      let root = [{ name: this.$t("ft.breadcrumb"), dir: "" }];
      if (!this.currentDir) {
        return root;
      }

      let parentDir = "";
      this.currentDir.split("/").forEach((item) => {
        if (item == "") return;

        root.push({ name: item, dir: parentDir + item + "/" });
        parentDir += `${item}/`;
      });
      return root;
    },
    loadedtips() {
      let loadedNum = this.rows.length
      if (loadedNum == this.total) {
        return `已全部加载，共${this.total}个`;
      }

      return `已加载${loadedNum}个，共${this.total}个`;
    },
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      if (this.currentDir != newVal.query.dir) {
        this.currentDir = newVal.query.dir; // change the current direction when the route changed
      }

      this.listRefresh();
    },
    onSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    onScrollEnd() {
      if (this.total != 0 && this.rows.length == this.total) {
        console.log("no more")
        return
      }

      this.listRefresh(this.offset, this.limit);
    },
    listRefresh(offset, limit) {
      if (!offset) {
        offset = 0
      }

      if (!limit) {
        limit = 10
      }

      this.loading = true;
      let dir = this.currentDir ? this.currentDir : "";
      this.dataLoader(dir, offset, limit).then((data) => {
        if (offset == 0) {
          this.rows = data.list
          this.offset = limit
        } else {
          this.rows = this.rows.concat(data.list);
          this.offset += this.limit
        }

        this.total = data.total;
        this.loading = false;
      });
    },
    buildQuery(dir) {
      if (dir.startsWith(this.rootDir)) {
        dir = dir.replace(this.rootDir, "");
      }

      let query = !dir ? {} : { dir: dir };
      return { query: query };
    },
    onClick(type, obj) {
      if (type == "folder") {
        this.$router.push(this.buildQuery(obj.fullpath));
        return;
      }

      this.linkLoader(obj).then((link) => {
        switch (type) {
          case "media":
            this.selected = obj;
            this.selected.url = link;
            this.mediavv = true;
            break;
          case "image":
            this.$refs.photoView.open(link);
            break;
          case "doc":
            window.open("http://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(link));
            break;
        }
      });
    },
  },
  mounted() {
    this.currentDir = this.$route.query.dir ? this.$route.query.dir : "";
  },
};
</script>

<style scoped>
.header {
  display: flex;
  flex-flow: row;
}

.bread {
  flex: 1;
}
.loadtips {
  width: 200px;
  text-align: right;
  font-size: 12px;
  color: #7c7c7c;
}
</style>