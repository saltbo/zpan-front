<template>
  <section>
    <Topbar logined />
    <el-container style="height: 100%">
      <el-aside width="200px" style="height: 100%; background-color: #f4f4f5">
        <el-menu :default-active="routeFullPath" background-color="#f4f4f5" router>
          <el-menu-item index="/admin/dashboard">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/admin/storages">
            <i class="el-icon-files"></i>
            <span slot="title">存储管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-submenu index="/admin/settings">
            <template slot="title">
              <i class="el-icon-files"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/admin/settings">站点信息</el-menu-item>
            <el-menu-item index="/admin/settings/email">发信邮箱</el-menu-item>
          </el-submenu>
        </el-menu>
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
      routeFullPath: "disk",
    };
  },
  watch: {
    $route(newVal, oldVal) {
      this.routeFullPath = newVal.fullPath;
    },
  },
  mounted() {
    this.routeFullPath = this.$route.fullPath;
  },
};
</script>

<style scoped>
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