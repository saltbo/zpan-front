<template>
  <v-app>
    <v-app-bar app clipped-left>
      <Topbar ref="topbar" />
    </v-app-bar>

    <v-navigation-drawer app clipped>
      <v-list dense nav>
        <v-list-item v-for="item in leftMenus" :key="item.path" @click="$router.push(item.path)" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 根据应用组件来调整你的内容 -->
    <v-main style="height: calc(100% - 65px)">
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <!-- 如果使用 vue-router -->
      <KeepAlive include="disk">
        <router-view @upload-action="onUploadClick" @audio-open="onAudioOpen"></router-view>
      </KeepAlive>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>

  <!-- <el-container style="height: 100%">
      <el-aside width="200px" class="menu" v-bind:class="{ 'menu-open': menuActive }">
        <div class="copyright">
        <span>Powered by</span>
        <a href="https://github.com/saltbo/zpan" target="_blank">ZPan</a>
        </div>
      </el-aside>
      <div class="menu-bg-mask" v-bind:class="{ 'mask-open': menuActive }"></div>

      <el-main style="height: calc(100% - 65px)">
        <router-view @upload-action="onUploadClick" @audio-open="onAudioOpen"></router-view>
      </el-main>
  </el-container>-->
</template>

<script>
import Vue from "vue";
import store from "@/store";
import router from "@/router";
import Topbar from "@/components/Topbar";
import { CSMixin } from "@/libs/mixin";
export default {
  mixins: [CSMixin],
  components: {
    Topbar,
  },
  beforeRouteEnter(to, from, next) {
    Vue.zpan.Storage.list().then((ret) => {
      let storages = ret.data.list;
      // 如果没有存储空间则强制跳去添加存储空间
      if (storages.length == 0) {
        next({ name: "storages" });
        return;
      }

      // 如果访问的是首页则自动跳去第一个存储空间
      if (to.path == "/") {
        router.push({ path: `/${storages[0].name}` });
        return;
      }

      store.commit("storages", storages);
      next();
    });
  },
  data() {
    return {};
  },
  computed: {
    currentBucket() {
      return this.$route.params.sname;
    },
    menuActive() {
      return `/${this.$route.params.sname}`;
    },
    leftMenuActive() {
      return this.$route.fullPath;
    },
    leftMenus() {
      let menus = [
        { path: `/${this.currentBucket}`, icon: "el-icon-document", title: this.$t("leftnav.files") },
        { path: `/${this.currentBucket}?type=doc`, icon: "el-icon-xx", title: this.$t("leftnav.doc") },
        { path: `/${this.currentBucket}/pic`, icon: "el-icon-xx", title: this.$t("leftnav.image") },
        { path: `/${this.currentBucket}?type=audio`, icon: "el-icon-xx", title: this.$t("leftnav.audio") },
        { path: `/${this.currentBucket}?type=video`, icon: "el-icon-xx", title: this.$t("leftnav.video") },
      ];

      if (this.cs.mode == 1) {
        let netdiskMenus = [
          { path: `/${this.currentBucket}/share`, icon: "el-icon-share", title: this.$t("leftnav.share") },
          { path: `/${this.currentBucket}/recyclebin`, icon: "el-icon-delete", title: this.$t("leftnav.recyclebin") },
        ];
        menus.push(...netdiskMenus);
      }

      return menus;
    },
  },
  watch: {
    $route(newVal, oldVal) { },
  },
  methods: {
    onUploadClick(obj) {
      this.$refs.topbar.uploadSelect(obj);
    },
    onAudioOpen(obj, link) {
      this.$refs.topbar.AplayerOpen(obj, link);
    },
  },
  mounted() { },
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

/* 右侧边栏样式 */
.el-aside .el-menu {
  border-right: solid 1px #fff;
  font-weight: 500;
  padding: 0 10px;
}

.el-aside .el-menu-item:focus,
.el-aside .el-menu-item:hover {
  outline: 0;
  background-color: #eaeaea !important;
}

.menu {
  width: 200px;
  height: 100%;
  background-color: #f4f4f5;
}

@media (max-width: 480px) {
  .menu {
    width: 0 !important;
  }

  .menu-open {
    position: fixed;
    width: 200px !important;
    z-index: 999;
  }

  .menu-bg-mask {
    height: 100%;
    position: absolute;
    background: rgba(1, 1, 1, 0.4);
    z-index: 998;
  }

  .mask-open {
    width: 100%;
  }
}
</style>
