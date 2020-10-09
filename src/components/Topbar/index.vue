<template>
  <el-header>
    <div class="logo">
      <img src="@/assets/logo.png" alt />
    </div>
    <el-menu class="navbar" :default-active="routeName" mode="horizontal" style="width: 100%" router>
      <el-menu-item index="/disk">网盘</el-menu-item>
      <el-menu-item index="/picture">图床</el-menu-item>
    </el-menu>

    <div style="position: absolute; right: 20px">
      <el-select v-model="$i18n.locale" size="mini" style="width: 100px; margin-right: 20px">
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

          <el-dropdown-item icon="el-icon-setting" command="settings" divided>{{ $t("topbar.settings") }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-switch-button" command="signout">{{ $t("topbar.signout") }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { zUser } from "@/libs/zpan";
import utils from "@/libs/utils";
const defaultAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
export default {
  data() {
    return {
      routeName: "",
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
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      this.routeName = newVal.name;
      this.routeFullPath = newVal.fullPath;
      this.userStorage();
    },
    userInfo() {
      this.$moreu.profile().then((ret) => {
        this.user = ret.data.user;
        this.profile = ret.data.profile;

        if (this.profile.avatar == "") {
          this.profile.avatar = defaultAvatar;
        }
      });
    },
    userStorage() {
      zUser.myStorage().then((data) => {
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
        case "settings":
          break;
        case "signout":
          window.location = "/moreu/signout";
          break;
      }
    },
  },
  mounted() {
    this.userInfo();
    this.userStorage();
    this.routeName = this.$route.name;
    this.routeFullPath = this.$route.fullPath;
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

.el-header .navbar {
  font-weight: bold;
}

.el-header .storage {
  margin: 15px 0;
}
</style>