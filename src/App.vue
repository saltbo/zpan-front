<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header>
        <el-row>
          <el-col :span="12">
            <div class="logo">
              <span>ZPan</span>
            </div>
            <!-- <el-autocomplete class="search" size="medium" prefix-icon="el-icon-search" placeholder="搜索..." v-model="searchKw" :trigger-on-focus="false" :fetch-suggestions="suggestions" @select="search"></el-autocomplete> -->
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-dropdown v-show="logined" trigger="click" @command="onDropdown">
              <el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle;"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-row style="padding: 20px; width: 280px;">
                  <el-col :span="11">
                    <el-avatar :size="90" :src="profile.avatar"></el-avatar>
                  </el-col>
                  <el-col :span="13">
                    <p>{{ profile.nickname}}</p>
                    <p style="color: rgba(0, 0, 0, 0.54); margin: 5px 0">{{ profile.email}}</p>
                    <el-tag>管理员</el-tag>
                  </el-col>
                </el-row>
                <el-dropdown-item icon="el-icon-s-home" command="profile" divided>个人主页</el-dropdown-item>
                <el-dropdown-item icon="el-icon-switch-button" command="signout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mutations } from "@/store";
import utils from "@/libs/utils";
export default {
  data() {
    return {
      searchKw: "",
      logined: true,
      defaultAvatar:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      profile: {},
    };
  },
  watch: {
    $route: "onRouteChange",
  },
  methods: {
    onRouteChange(newVal, oldVal) {
      // this.userInfo();
    },
    suggestions(kw, cb) {
      var results = [
        { value: `在我的文件中搜索 ${kw}` },
        { value: `在全站分享中搜索 ${kw}` },
      ];
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    search() {},
    userInfo() {
      this.$moreu.profile().then((profile) => {
        this.profile = profile;
        if (this.profile.avatar == "") {
          this.profile.avatar = this.defaultAvatar;
        }
        console.log(this.profile);
      });
    },
    userStorage() {
      this.$axios.get("/api/storage").then((data) => {
        let storage = data.data;
        console.log(storage);
        this.storage = {
          used: utils.formatBytes(storage.used, 0),
          max: utils.formatBytes(storage.max, 0),
          percentage: Math.round((storage.used / storage.max) * 100),
        };
        mutations.setStorage(this.storage);
      });
    },
    onDropdown(index) {
      switch (index) {
        case "profile":
          break;
        case "signout":
          window.location = "/moreu/signout";
          // this.$moreu.signout();
          break;
      }
    },
  },
  mounted() {
    // this.userInfo();
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
  color: #fff;
  line-height: 60px;
  background-color: #3f51b5;
}
.el-header .logo {
  width: 150px;
  display: inline-block;
  font-size: 35px;
  padding: 0 15px;
  vertical-align: middle;
}
.el-header .search {
  width: 300px;
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