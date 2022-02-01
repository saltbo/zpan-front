<template>
  <div style="display: contents">
    <div class="logo">
      <img src="@/assets/logo.png" alt="ZPan" />
    </div>
    <v-tabs background-color="transparent" align-with-title>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab v-for="item in $store.state.storages.slice(0, 5)" :key="item.alias">{{ item.title }}</v-tab>
    </v-tabs>
    <div class="tools-bar">
      <v-menu v-model="ulistTotal" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-badge color="red" dot>
            <v-icon v-bind="attrs" v-on="on">mdi-transfer-up</v-icon>
          </v-badge>
        </template>

        <v-card>
          <zp-uploader ref="uploader" @uploadAdded="$refs.ulist.doShow()" @utotal-change="onUTotalChange"></zp-uploader>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { setup } from "@/i18n";
import utils from "@/libs/utils";
import Cookie from "js-cookie";
const defaultAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
import ZpUploader from "@/components/Uploader";
import ZpAplayer from "@/components/ZAPlayer";
export default {
  components: {
    ZpUploader,
    ZpAplayer,
  },
  props: {
    menus: Array,
    logined: Boolean,
  },
  data() {
    return {
      alistVisible: false,
      ulistTotal: 0,
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
    onLogoClick() {
      this.$emit('logoClick');
      if (this.$route.path == '/admin') {
        this.$router.push('/')
      }
    },
    onRouteChange(newVal, oldVal) {
      if (this.logined) {
        this.userInfo();
      }
    },
    onUTotalChange(uTotal) {
      this.ulistTotal = uTotal;
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
    uploadSelect(obj) {
      console.log(222, obj,this.$refs.uploader)
      // this.$refs.uploader.uploadSelect(obj);
    },
    AplayerOpen(obj, link) {
      this.alistVisible = true;
      setTimeout(() => {
        this.$refs.aplayer.play(obj, link);
        this.$refs.alist.doShow();
      }, 500);
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
/* .el-header {
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
} */

.logo {
  width: 180px;
  /* display: inline-block; */
  font-size: 35px;
  padding: 0 15px;
  /* vertical-align: middle; */
}

.logo img {
  cursor: pointer;
}

/* .el-header .navbar {
  font-weight: bold;
}

.el-header .storage {
  margin: 15px 0;
} */
</style>