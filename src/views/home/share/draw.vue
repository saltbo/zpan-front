<template>
  <div class="warp">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="header clearfix">
        <span class="name">{{ info.name }}</span>
        <span class="time">分享于{{ info.created | moment("YYYY-MM-DD HH:hh") }}</span>
      </div>

      <el-form class="form" label-position="top" label-width="80px">
        <el-form-item :label="$t('share.drawcode-placeholder')">
          <el-input v-model="drawcode" size="medium" autofocus style="width: 310px; margin-right: 10px"></el-input>
          <el-button type="primary" size="medium" @click="draw(info.alias)">{{ $t("share.drawfile") }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      drawcode: "",
    };
  },
  methods: {
    draw(alias) {
      this.$zpan.Share.draw(alias, this.drawcode).then((ret) => {
        localStorage.setItem("zpan-share", alias);
        this.$router.push({ name: "share-info" });
      });
    },
  },
  mounted() {
    this.$zpan.Share.find(this.$route.params.alias).then((ret) => {
      this.info = ret.data;
      document.title = `${this.info.name} | Zpan`;
    });
  },
};
</script>

<style>
.warp {
  background: #eef2f6 !important;
  padding-top: 100px;
}
.box-card {
  width: 500px;
  margin: 0 auto;
}

.header .name {
  font-weight: bold;
  font-size: 20px;
}
.header .time {
  float: right;
  font-size: 13px;
}
.form {
  padding: 10px 20px;
}
</style>