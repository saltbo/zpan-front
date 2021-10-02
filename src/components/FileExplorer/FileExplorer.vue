<template>
  <div style="height: 100%">
    <el-row class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.dir" :index="item.dir" :to="buildQuery(item.dir)">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="loadtips" style="float: right">{{ loadedtips }}</span>
    </el-row>

    <!-- explorer -->
    <GridExplorer v-model="rows" :loading="loading" :moreButtons="moreButtons" @on-click="onClick" v-if="layout == 'grid'" />
    <ListExplorer v-model="rows" :loading="loading" :rowButtons="rowButtons" :moreButtons="moreButtons" @on-click="onClick" @scroll-end="onScrollEnd" @selection-change="onSelectionChange" v-else />
  </div>
</template>

<script>
import GridExplorer from "./explorer/GridExplorer";
import ListExplorer from "./explorer/ListExplorer";
export default {
  components: {
    GridExplorer,
    ListExplorer,
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
      limit: 100,
      rows: [],
      total: 0,
      selection: Array,
    };
  },
  watch: {
    $route: "onRouteChange",
    layout(nv, ov) {
      if (nv != ov) {
        this.listRefresh();
      }
    },
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
      let loadedNum = this.rows.length;
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
        console.log("no more");
        return;
      }

      this.listRefresh(this.offset, this.limit);
    },
    listRefresh(offset, limit) {
      if (!offset) {
        offset = 0;
      }

      if (!limit) {
        limit = this.limit;
      }

      this.loading = true;
      let dir = this.currentDir ? this.currentDir : "";
      this.dataLoader(dir, offset, limit).then((data) => {
        if (offset == 0) {
          this.rows = data.list;
          this.offset = limit;
        } else {
          this.rows = this.rows.concat(data.list);
          this.offset += this.limit;
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
        this.$emit("file-open", type, obj, link);
      });
    },
  },
  mounted() {
    this.currentDir = this.$route.query.dir ? this.$route.query.dir : "";

    // this.listRefresh();
  },
};
</script>

<style scoped>
@import url("./iconfont.css");

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