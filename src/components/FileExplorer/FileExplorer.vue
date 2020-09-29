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
    <ListExplorer v-model="rows" :loading="loading" :rowButtons="rowButtons" :moreButtons="moreButtons" @on-click="onClick" @selection-change="onSelectionChange" v-else />

    <!-- viewer -->
    <PhotoPreview ref="photoView"></PhotoPreview>
    <MediaViewer v-model="selected" :visible="mediavv" @close="mediavv = false"></MediaViewer>
  </div>
</template>

<script>
import GridExplorer from "./GridExplorer";
import ListExplorer from "./ListExplorer";
import PhotoPreview from "../PhotoPreview.vue";
import MediaViewer from "../MediaViewer.vue";
export default {
  components: {
    GridExplorer,
    ListExplorer,
    PhotoPreview,
    MediaViewer,
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
  },
  data() {
    return {
      currentDir: "",
      loading: false,
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
      console.log(123, this.currentDir);
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
      if (this.rows.length == this.total) {
        return `已全部加载，共${this.total}个`;
      }

      return `已加载${this.rows.length}个，共${this.total}个`;
    },
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      console.log(111, newVal, oldVal);
      // 外部路由发生变化时切换目录拉取数据
      this.listRefresh(newVal.query.dir);
    },
    onSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    listRefresh(dir) {
      this.loading = true;
      this.currentDir = dir;
      this.dataLoader(this.currentDir).then((data) => {
        console.log(111, data);
        this.rows = data.list;
        this.total = data.total;
        this.loading = false;
      });
    },
    buildQuery(dir) {
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
    // 启动时主动拉取数据
    this.listRefresh(this.$route.query.dir);
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