<template>
  <div style="height: 100%">
    <el-row class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
        <el-breadcrumb-item
          v-for="item in breadcrumb"
          :key="item.dir"
          :index="item.dir"
          :to="buildQuery(item.dir)"
        >{{ item.name }}</el-breadcrumb-item>
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
import GridExplorer from "./explorer/GridExplorer";
import TableExplorer from "./explorer/TableExplorer";
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
        this.$emit("selection-change", nv.filter(el => el.selected == true));
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
    onSelectionChange(selection) {
      // this.$emit("selection-change", selection);
    },
    onScrollEnd() {
      if (this.total != 0 && this.rows.length == this.total) {
        console.log("no more");
        return;
      }

      this.listRefresh(this.offset, this.limit);
    },
    buildIcon(matter) {
      if (matter.dirtype > 0) {
        matter.icon = { name: 'folder', color: '#ffc402' }
        return matter
      }


      let type = matter.type
      let [t1, t2] = type.split('/')
      console.log(type, '=>', t1, t2)

      let t1Icons = {
        audio: { name: 'book-music', color: 'rgb(55, 159, 211)' },
        video: { name: 'file-video', color: 'rgb(128, 149, 255)' },
        image: { name: 'file-image', color: 'rgb(18, 150, 219)' },
        text: { name: 'file-document', color: 'rgb(13, 71, 161)' },
        zip: { name: 'zip-box', color: 'rgb(244, 196, 70)' },
        'x-zip': { name: 'zip-box', color: 'rgb(244, 196, 70)' },
        json: { name: 'code-json', color: '' },
        xml: { name: 'xml', color: '' },
      }

      let t2Icons = {
        pdf: { name: 'file-pdf-box', color: '' },
        psd: { name: 'file-psd', color: '' },
        rtf: { name: 'file-rtf', color: '' },
        markdown: { name: 'language-markdown', color: '' },
        xml: { name: 'xml', color: '' },
        'msword': { name: 'file-word', color: '' },
        'vnd.ms-excel': { name: 'file-excel', color: '' },
        'vnd.ms-powerpoint': { name: 'file-powerpoint', color: '' },
        'vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'file-word', color: '' },
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'file-excel', color: '' },
        'vnd.openxmlformats-officedocument.presentationml.presentation': { name: 'file-powerpoint', color: '' },
      }

      if (Object.keys(t2Icons).includes(t2)) {
        matter.icon = t2Icons[t2]
      } else if (Object.keys(t1Icons).includes(t1)) {
        matter.icon = t1Icons[t1]
      } else {
        matter.icon = { name: 'file', color: '#c9c9c9' }
      }

      return matter
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
          this.rows = data.list.map(this.buildIcon);
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
  },
  mounted() {
    this.currentDir = this.$route.query.dir ? this.$route.query.dir : "";

    // this.listRefresh();
    setTimeout(this.listRefresh, 100)
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