<template>
  <el-header>
    <div class="logo">
      <img src="@/assets/logo.png" alt="ZPan" @click="$router.push('/')" />
    </div>
    <el-menu v-if="showMenu" class="navbar" :default-active="menuActive" mode="horizontal" style="width: 100%" router>
      <el-menu-item v-for="(menu, index) in menus.slice(0, 5)" :key="index" :index="`/${menu.name}`">{{ menu.title }}</el-menu-item>

      <el-submenu index="more" v-show="menus.length > 5">
        <template slot="title">更多</template>
        <el-menu-item v-for="(menu, index) in menus.slice(5)" :key="index" :index="menu.path">{{ menu.title }}</el-menu-item>
      </el-submenu>
    </el-menu>

    <div style="position: absolute; right: 20px">
      <el-dropdown v-show="logined" trigger="click" @command="onDropdown" @visible-change="onVisible">
        <el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle; margin-right: 4px"></el-avatar>
        <span>{{ profile.nickname }}</span>
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

          <el-dropdown-item icon="el-icon-setting" command="profile" divided>{{ $t("topbar.settings") }}</el-dropdown-item>
          <el-dropdown-item icon="el-icon-set-up" command="admin" v-show="showAdmin">{{ $t("topbar.s-platform") }}</el-dropdown-item>
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
    logined: Boolean,
  },
  data() {
    return {
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
      return this.menus && this.menus.length > 0;
    },
    showAdmin() {
      return Cookie.get("z-role") == "admin";
    },
    menuActive() {
      return `/${this.$route.params.sname}`;
    },
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      if (this.logined) {
        this.userInfo();
      }
    },
    userInfo() {
      this.$zpan.User.profileGet().then((ret) => {
        this.user = ret.data;
        this.profile = this.user.profile;
        if (this.profile.avatar == "") {
          this.profile.avatar = defaultAvatar;
        }

        if (this.profile.locale) {
          this.$i18n.locale = this.profile.locale;
        }

        this.storage = {
          used: utils.formatBytes(this.user.storage.used, 0),
          max: utils.formatBytes(this.user.storage.max, 0),
          percentage: Math.round((this.user.storage.used / this.user.storage.max) * 10000) / 100,
        };
      });
    },
    onDropdown(index) {
      this.$router.push({ name: index });
    },
    onVisible(visible) {
      if (visible) this.userInfo();
    },
  },
  mounted() {
    if (this.logined) {
      this.userInfo();
    }
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