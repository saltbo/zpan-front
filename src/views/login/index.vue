<template>
  <div id="app">
    <Topbar />
    <router-view></router-view>
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
}

#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: '12px/1.5 "Microsoft YaHei", arial, SimSun, 宋体;';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f9f9f9;
  height: 100%;
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