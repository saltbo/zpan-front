<template>
  <section>
    <Topbar :menus="storages" />
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
import Topbar from "@/components/Topbar";
export default {
  components: {
    Topbar,
  },
  data() {
    return {
      storages: [],
      modes: [],
      leftMenus: [],
    };
  },
  computed: {
    currentBucket() {
      return this.$route.params.sname;
    },
  },
  watch: {
    $route(newVal, oldVal) {
      this.loadDefaultStorage();
      this.createLeftMenus(); // fixme: 不知道为什么重建后的菜单想点击的时候没有高亮了
    },
    storages(nl, ol) {
      this.loadDefaultStorage();
    },
  },
  methods: {
    createLeftMenus(mode) {
      // todo 根据存储类型切换左侧菜单栏内容
      let diskMenus = [
        { path: `/${this.currentBucket}`, icon: "el-icon-document", title: this.$t("leftnav.files") },
        { path: `/${this.currentBucket}?type=doc`, icon: "el-icon-xx", title: this.$t("leftnav.doc") },
        { path: `/${this.currentBucket}?type=audio`, icon: "el-icon-xx", title: this.$t("leftnav.audio") },
        { path: `/${this.currentBucket}?type=video`, icon: "el-icon-xx", title: this.$t("leftnav.video") },
        { path: `/${this.currentBucket}/share`, icon: "el-icon-share", title: this.$t("leftnav.share") },
        { path: `/${this.currentBucket}/recyclebin`, icon: "el-icon-delete", title: this.$t("leftnav.recyclebin") },
      ];
      let browserMenus = [
        { path: `/${this.currentBucket}`, icon: "el-icon-document", title: this.$t("leftnav.files") },
        { path: `/${this.currentBucket}/latest`, icon: "el-icon-xx", title: "最近" },
        { path: `/${this.currentBucket}?type=sc`, icon: "el-icon-xx", title: "收藏" },
        { path: `/${this.currentBucket}?type=label`, icon: "el-icon-xx", title: "标签" },
      ];

      this.leftMenus = this.modes[this.currentBucket] == 1 ? diskMenus : browserMenus;
    },
    loadStorages() {
      this.$zpan.Storage.list().then((ret) => {
        this.storages = ret.data.list;

        // cache the sid
        this.storages.forEach((ele) => {
          this.modes[ele.name] = ele.mode;
          localStorage.setItem(`bucket-${ele.name}`, ele.id);
        });
        this.createLeftMenus();
      });
    },
    loadDefaultStorage() {
      // 如果没有存储空间则强制跳去添加存储空间
      if (this.storages.length == 0) {
        this.$router.push({ name: "storages" });
        return;
      }

      // 只有访问首页的时候且menus数据加载完之后才跳去第一个菜单
      if (this.$route.fullPath == "/") {
        this.$router.push({ path: `/${this.storages[0].name}` });
      }
    },
  },
  mounted() {
    this.loadStorages();
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
