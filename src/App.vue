<template>
  <div id="app">
    <Topbar />
    <router-view style="height: 100%"></router-view>
  </div>
</template>

<script>
import Topbar from "@/components/Topbar";
export default {
  components: {
    Topbar,
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
  mounted() {},
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

/* 右侧边栏样式 */
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