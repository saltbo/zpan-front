<template>
  <section>
    <Topbar :menus="topMenus" />
    <el-container style="height: 100%">
      <el-aside width="200px" style="height: 100%; background-color: #f4f4f5">
        <el-menu :default-active="$route.fullPath" background-color="#f4f4f5" router>
          <el-menu-item v-for="(menu, index) in leftMenus" :key="index" :index="menu.path">
            <i :class="menu.icon"></i>
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </el-menu>

        <!-- <div class="copyright">
        <span>Powered by</span>
        <a href="https://github.com/saltbo/zpan" target="_blank">ZPan</a>
      </div>-->
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </section>
</template>

<script>
import { zStorage } from "@/libs/zpan";
import Topbar from "@/components/Topbar";
export default {
  components: {
    Topbar,
  },
  data() {
    return {
      current: {
        bucket: "",
        type: "ns",
      },
      topMenus: [],
    };
  },
  computed: {
    leftMenus() {
      this.current.bucket = this.$route.params.sname;

      // todo 根据存储类型切换左侧菜单栏内容
      let diskMenus = [
        { path: `/${this.current.bucket}`, icon: "el-icon-document", title: this.$t("leftnav.files") },
        { path: `/${this.current.bucket}?type=doc`, icon: "el-icon-xx", title: this.$t("leftnav.doc") },
        { path: `/${this.current.bucket}?type=audio`, icon: "el-icon-xx", title: this.$t("leftnav.audio") },
        { path: `/${this.current.bucket}?type=video`, icon: "el-icon-xx", title: this.$t("leftnav.video") },
        { path: `/${this.current.bucket}/share`, icon: "el-icon-share", title: this.$t("leftnav.share") },
        { path: `/${this.current.bucket}/recyclebin`, icon: "el-icon-delete", title: this.$t("leftnav.recyclebin") },
      ];
      let browserMenus = [
        { path: `/${this.current.bucket}`, icon: "el-icon-document", title: this.$t("leftnav.files") },
        { path: `/${this.current.bucket}/latest`, icon: "el-icon-xx", title: "最近" },
        { path: `/${this.current.bucket}?type=sc`, icon: "el-icon-xx", title: "收藏" },
        { path: `/${this.current.bucket}?type=label`, icon: "el-icon-xx", title: "标签" },
      ];

      return this.current.type == "ns" ? diskMenus : browserMenus;
    },
  },
  watch: {
    $route(newVal, oldVal) {
      this.loadDefaultStorage();
    },
    topMenus(nl, ol) {
      this.loadDefaultStorage();
    },
  },
  methods: {
    loadDefaultStorage() {
      // 只有访问首页的时候且menus数据加载完之后才跳去第一个菜单
      if (this.$route.fullPath == "/" && this.topMenus.length > 0) {
        this.$router.push({ path: `/${this.topMenus[0].name}` });
      }
    },
  },
  mounted() {
    this.topMenus = [];
    zStorage.list().then((ret) => {
      this.topMenus = ret.data.list.map((item) => {
        item.title = item.name;

        // cache the sid
        localStorage.setItem(`bucket-${item.name}`, item.id);
        return item;
      });
    });
  },
};
</script>

<style scoped>
.copyright {
  text-align: center;
  position: absolute;
  bottom: 20px;
  font-size: 10px;
}

.el-main {
  padding: 10px !important;
}
</style>
