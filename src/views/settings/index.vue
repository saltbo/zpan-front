<template>
  <section>
    <Topbar :menus="$store.state.storages" logined />
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
import Vue from "vue";
import store from "@/store";
import Topbar from "@/components/Topbar";
export default {
  components: {
    Topbar,
  },
  beforeRouteEnter(to, from, next) {
    Vue.zpan.Storage.list().then((ret) => {
      let storages = ret.data.list;
      store.commit("storages", storages);
      next();
    });
  },
  data() {
    return {};
  },
  computed: {
    leftMenuActive() {
      return this.$route.fullPath;
    },
    leftMenus() {
      return [
        { path: `/settings/profile`, icon: "el-icon-share", title: "个人设置" },
        { path: `/settings/security`, icon: "el-icon-delete", title: "密码修改" },
      ];
    },
  },
  watch: {},
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

/* 右侧边栏样式 */
.el-aside .el-menu {
  border-right: solid 1px #fff;
  font-weight: 500;
}

.el-aside .el-menu-item:focus,
.el-aside .el-menu-item:hover {
  outline: 0;
  background-color: #eaeaea !important;
}
</style>
