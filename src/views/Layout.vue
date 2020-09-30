<template>
  <el-container>
    <el-aside width="200px" style="height: 100%; background-color: #f4f4f5">
      <el-menu :default-active="active" background-color="#f4f4f5" router>
        <el-menu-item index="/disk">
          <i class="el-icon-document"></i>
          <span slot="title">{{ $t("leftnav.files") }}</span>
        </el-menu-item>
        <el-menu-item index="/disk?type=doc">
          <i class="el-icon-xx"></i>
          <span slot="title">{{ $t("leftnav.doc") }}</span>
        </el-menu-item>
        <el-menu-item index="/disk?type=image">
          <i class="el-icon-xx"></i>
          <span slot="title">{{ $t("leftnav.image") }}</span>
        </el-menu-item>
        <el-menu-item index="/disk?type=audio">
          <i class="el-icon-xx"></i>
          <span slot="title">{{ $t("leftnav.audio") }}</span>
        </el-menu-item>
        <el-menu-item index="/disk?type=video">
          <i class="el-icon-xx"></i>
          <span slot="title">{{ $t("leftnav.video") }}</span>
        </el-menu-item>
        <el-menu-item index="/share">
          <i class="el-icon-share"></i>
          <span slot="title">{{ $t("leftnav.share") }}</span>
        </el-menu-item>
        <el-menu-item index="/recyclebin">
          <i class="el-icon-delete"></i>
          <span slot="title">{{ $t("leftnav.recyclebin") }}</span>
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
</template>

<script>
export default {
  name: "app",
  components: {},
  data() {
    return {
      active: "disk",
    };
  },
  watch: {
    $route: "onRouteChange",
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      this.active = newVal.fullPath;
    },
  },
  mounted() {
    this.active = this.$route.fullPath;
  },
};
</script>

<style scoped>
.el-main {
  padding: 10px !important;
}
.copyright {
  text-align: center;
  position: absolute;
  bottom: 20px;
  font-size: 10px;
}

.el-aside .el-menu {
  border-right: solid 1px #fff;
  font-weight: 500;
}

.el-aside .el-menu-item {
  padding-left: 30px !important;
}

.el-aside .el-menu-item:focus,
.el-aside .el-menu-item:hover {
  outline: 0;
  background-color: #eaeaea !important;
}
</style>
