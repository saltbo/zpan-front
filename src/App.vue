<template>
  <router-view id="app"></router-view>
</template>

<script>
export default {
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  mounted() {
    // setup clipboard
    this.$clipboard.on("success", (e) => {
      this.$message.success(this.$t("msg.copy-success"));
      e.clearSelection();
    });
    this.$clipboard.on("error", (e) => {
      this.$message.error(this.$t("msg.copy-failed"));
    });
  },
  beforeDestroy() {
    this.$clipboard.destroy();
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
</style>