<template>
  <el-header>
    <div class="logo">
      <img src="@/assets/logo.png" alt="ZPan" @click="$router.push('/')" />
    </div>
    <el-menu v-if="showMenu" class="navbar" :default-active="$route.path" mode="horizontal" style="width: 100%" router>
      <el-menu-item v-for="(menu, index) in menus.slice(0, 5)" :key="index" :index="`/${menu.name}`">{{ menu.title }}</el-menu-item>

      <el-submenu index="more" v-show="menus.length > 5">
        <template slot="title">更多</template>
        <el-menu-item v-for="(menu, index) in menus.slice(5)" :key="index" :index="menu.path">{{ menu.title }}</el-menu-item>
      </el-submenu>
    </el-menu>

    <div style="position: absolute; right: 20px">
      <el-select v-model="locale" size="mini" style="width: 100px; margin-right: 20px">
        <el-option v-for="lang in langs" :key="lang.value" :value="lang.value" :label="lang.label">{{ lang.label }}</el-option>
      </el-select>
      <el-dropdown v-show="logined" trigger="click" @command="onDropdown">
        <el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle"></el-avatar>
        <el-dropdown-menu slot="dropdown" style="width: 200px">
          <div style="margin: auto 20px">
            <el-row style="text-align: center; margin: 10px 0">
              <el-avatar :size="50" :src="profile.avatar"></el-avatar>
            </el-row>
            <el-row class="storage">
              <p>
                <span style>{{ $t("leftnav.storage") }}</span>
                <span style="float: right">{{ storage.percentage }}%</span>
              </p>
              <el-progress :percentage="storage.percentage" :show-text="false"></el-progress>
              <p style="color: rgba(0, 0, 0, 0.54); font-size: 0.75rem">{{ storage.used }}/{{ storage.max }}</p>
            </el-row>
          </div>

          <el-dropdown-item icon="el-icon-user" command="profile" divided>{{ $t("topbar.profile") }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-setting" command="admin" v-show="showAdmin">{{ $t("topbar.s-platform") }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" command="signout">{{ $t("topbar.signout") }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { setup } from "@/i18n";
import utils from "@/libs/utils";
import Cookie from "js-cookie";
const defaultAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
export default {
  props: {
    menus: Array,
  },
  data() {
    return {
      locale: this.$i18n.locale,
      langs: [
        { label: "中文", value: "zh-CN" },
        { label: "English", value: "en" },
      ],
      logined: true,
      storage: {
        percentage: 0,
      },
      user: {},
      profile: {},
    };
  },
  watch: {
    $route: "onRouteChange",
    locale(nv) {
      setup(nv);
    },
  },
  computed: {
    showMenu() {
      let path = this.$route.path;
      return path == "/" ? false : !path.startsWith("/m/admin");
    },
    showAdmin() {
      return Cookie.get("moreu-role") == "admin";
    },
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      this.userStorage();
    },
    userInfo() {
      // this.$moreu.profile().then((ret) => {
      //   this.user = ret.data.user;
      //   this.profile = ret.data.profile;
      //   if (this.profile.avatar == "") {
      //     this.profile.avatar = defaultAvatar;
      //   }
      // });
    },
    userStorage() {
      this.$zpan.User.myStorage().then((data) => {
        let user = data.data;
        this.storage = {
          used: utils.formatBytes(user.storage_used, 0),
          max: utils.formatBytes(user.storage_max, 0),
          percentage: Math.round((user.storage_used / user.storage_max) * 10000) / 100,
        };
      });
    },
    onDropdown(index) {
      switch (index) {
        case "admin":
          this.$router.push({ name: "admin" });
          break;
        case "profile":
          window.open("/zplat/profile", "_blank");
          break;
        case "signout":
          window.location = "/zplat/signout";
          break;
      }
    },
  },
  mounted() {
    this.userInfo();
    this.userStorage();
  },
};
</script>

<style>
.el-header {
  display: flex;
  line-height: 60px;
  background-color: #fff;
  box-shadow: 1px 1px 8px #c9c9c9;
  margin-bottom: 5px;
}
.el-header .logo {
  width: 150px;
  display: inline-block;
  font-size: 35px;
  padding: 0 15px;
  vertical-align: middle;
}

.logo img {
  cursor: pointer;
}

.el-header .navbar {
  font-weight: bold;
}

.el-header .storage {
  margin: 15px 0;
}
</style>