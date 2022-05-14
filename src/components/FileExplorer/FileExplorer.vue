<template>
  <div style="height: 100%">
    <el-row class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.dir" :index="item.dir" :to="buildQuery(item.dir)">{{ item.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="loadtips" style="float: right">{{ loadedtips }}</span>
    </el-row>

    <!-- explorer -->
    <template v-if="layout == 'list'">
      <TableExplorer v-model="rows" :linkLoader="linkLoader" @scroll-end="onScrollEnd" />
    </template>
    <template v-else>
      <GridExplorer v-model="rows" :linkLoader="linkLoader" @scroll-end="onScrollEnd" />
    </template>
  </div>
</template>

<script>
import GridExplorer from "./layout/grid";
import TableExplorer from "./layout/table";
import FileViewer from "./viewer";
import { registerAction, openShare, openOutline, openMove, openRename, openRemove } from "./libs/userop"
import buildIcon from "./libs/icons"
export default {
  components: {
    GridExplorer,
    TableExplorer,
  },
  props: {
    layout: {
      type: String,
      default: "list",
    },
    rootDir: {
      type: String,
      default: "",
    },
    dataLoader: Function,
    linkLoader: Function,
    actionMove: Function,
    actionCopy: Function,
    actionRename: Function,
    actionRemove: Function,
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
    rows: {
      deep: true,
      handler(nv, ov) {
        this.selection = nv.filter(el => el.selected == true)
        this.$emit("selection-change", this.selection);
      }
    }
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
          this.rows = data.list.map(buildIcon);
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
    openCtxMenu(event, item) {
      this.$contextmenu({
        items: [
          { label: "打开", onClick: () => { this.onNameClick(item) }, divided: true },
          { label: "下载", onClick: () => this.openDownload(item) },
          { label: "分享", onClick: () => openShare(item) },
          // { label: "获取链接", onClick: () => openOutline(item), divided: true },
          // { label: "复制到", onClick: () => this.openCopy(item) },
          { label: "移动到", onClick: () => openMove(item) },
          { label: "重命名", onClick: () => openRename(item).then(this.listRefresh), divided: true },
          { label: "删除", onClick: () => openRemove(item).then(this.listRefresh) }
        ],
        event,
        //x: event.clientX,
        //y: event.clientY,
        customClass: "custom-class",
        zIndex: 3,
        minWidth: 230
      });
      return false;
    },
    onNameClick(item) {
      // open a folder
      if (item.dirtype) {
        this.$router.push(this.buildQuery(item.fullpath));
        return;
      }

      // todo 支持外部查看器打开文件

      // open file by the built-in file viewer
      new FileViewer(this.linkLoader).view(item);
    },
    buildQuery(dir) {
      if (dir.startsWith(this.rootDir)) {
        dir = dir.replace(this.rootDir, "");
      }

      let query = !dir ? {} : { dir: dir };
      return { query: query };
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
    openOutline() {
      openOutline(...this.selection)
    },
    openMove() {
      openMove(...this.selection).then(this.listRefresh)
    },
    openRemove() {
      openRemove(...this.selection).then(this.listRefresh)
    },
  },
  mounted() {
    this.currentDir = this.$route.query.dir ? this.$route.query.dir : "";

    // this.listRefresh();
    setTimeout(this.listRefresh, 100)
    registerAction('move', this.actionMove)
    registerAction('remove', this.actionRemove)
    registerAction('rename', this.actionRename)
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