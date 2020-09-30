<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header>
        <div class="logo">
          <img src="./assets/logo.png" alt />
        </div>
        <el-menu class="navbar" :default-active="activeIndex" mode="horizontal" style="width: 100%" router>
          <el-menu-item index="disk">网盘</el-menu-item>
          <el-menu-item index="picture">图床</el-menu-item>
        </el-menu>

        <div style="position: absolute; right: 20px">
          <el-select v-model="$i18n.locale" size="mini" style="width: 100px; margin-right: 20px;">
            <el-option v-for="lang in langs" :key="lang.value" :value="lang.value" :label="lang.label">{{ lang.label }}</el-option>
          </el-select>
          <el-dropdown v-show="logined" trigger="click" @command="onDropdown">
            <el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle;"></el-avatar>
            <el-dropdown-menu slot="dropdown" style="width:200px;">
              <div style="margin: auto 20px;">
                <el-row style="text-align: center; margin: 10px 0;">
                  <el-avatar :size="50" :src="profile.avatar"></el-avatar>
                </el-row>
                <el-row class="storage">
                  <p>
                    <span style>{{ $t('leftnav.storage') }}</span>
                    <span style="float: right;">{{storage.percentage}}%</span>
                  </p>
                  <el-progress :percentage="storage.percentage" :show-text="false"></el-progress>
                  <p style="color: rgba(0, 0, 0, 0.54); font-size: 0.75rem;">{{storage.used}}/{{storage.max}}</p>
                </el-row>
              </div>

              <el-dropdown-item icon="el-icon-setting" command="settings" divided>{{ $t('topbar.settings') }}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" command="signout">{{ $t('topbar.signout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { zUser } from "@/libs/zpan";
import utils from "@/libs/utils";
export default {
  data() {
    return {
      activeIndex: "disk",
      langs: [
        { label: "中文", value: "zh-CN" },
        { label: "English", value: "en" },
      ],
      logined: true,
      defaultAvatar:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
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
      this.activeIndex = newVal.name;
      this.userStorage();
    },
    userInfo() {
      this.$moreu.profile().then((ret) => {
        this.user = ret.data.user;
        this.profile = ret.data.profile;

        if (this.profile.avatar == "") {
          this.profile.avatar = this.defaultAvatar;
        }
      });
    },
    userStorage() {
      zUser.myStorage().then((data) => {
        let user = data.data;
        this.storage = {
          used: utils.formatBytes(user.storage_used, 0),
          max: utils.formatBytes(user.storage_max, 0),
          percentage:
            Math.round((user.storage_used / user.storage_max) * 10000) / 100,
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
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: '12px/1.5 "Microsoft YaHei", arial, SimSun, 宋体;';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #fff;
  height: 100%;
}

.el-header {
  display: flex;
  line-height: 60px;
  background-color: #fff;
  box-shadow: 1px 1px 8px #c9c9c9;
  z-index: 1;
}
.el-header .logo {
  width: 150px;
  display: inline-block;
  font-size: 35px;
  padding: 0 15px;
  vertical-align: middle;
}
.navbar {
  font-weight: bold;
}

.storage {
  margin: 15px 0;
}

.guest .el-card__header {
  text-align: center;
  border-bottom: none !important;
}
.guest .el-card__header .title {
  font-size: 20px;
  margin-top: 10px;
}
.guest .el-card__header .icon {
  font-size: 30px;
  color: #f50057;
}
</style>