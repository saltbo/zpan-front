<template>
  <section>
    <Topbar />
    <el-container style="height: 100%">
      <el-aside width="200px" style="height: 100%; background-color: #f4f4f5">
        <el-menu :default-active="routeFullPath" background-color="#f4f4f5" router>
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
