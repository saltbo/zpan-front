<template>
  <section>
    <Topbar :menus="storages" />
    <el-container style="height: 100%">
      <el-aside width="200px" style="height: 100%; background-color: #f4f4f5">
        <el-menu :default-active="leftMenuActive" background-color="#f4f4f5" router>
          <el-menu-item v-for="menu in leftMenus" :key="menu.path" :index="menu.path">
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
    return {};
  },
  computed: {
    storages() {
      return this.$store.state.storages;
    },
    cs() {
      return this.$store.state.cs;
    },
    currentBucket() {
      return this.$route.params.sname;
    },
    leftMenuActive() {
      console.log(this.$route.fullPath, 111);
      return this.$route.fullPath;
    },
    leftMenus() {
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
        { path: `/${this.currentBucket}?type=doc`, icon: "el-icon-xx", title: this.$t("leftnav.doc") },
        { path: `/${this.currentBucket}?type=audio`, icon: "el-icon-xx", title: this.$t("leftnav.audio") },
        { path: `/${this.currentBucket}?type=video`, icon: "el-icon-xx", title: this.$t("leftnav.video") },
        // { path: `/${this.currentBucket}?dir=image`, icon: "el-icon-picture-outline", title: "全部图片" },
        // { path: `/${this.currentBucket}?type=sc`, icon: "el-icon-xx", title: "收藏" },
        // { path: `/${this.currentBucket}?type=label`, icon: "el-icon-xx", title: "标签" },
      ];

      return this.cs.mode == 1 ? diskMenus : browserMenus;
    },
  },
  watch: {
    $route(newVal, oldVal) {},
  },
  methods: {},
  mounted() {},
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
