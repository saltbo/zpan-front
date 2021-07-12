<template>
  <el-card shadow="never" class="box-card">
    <div slot="header" class="clearfix">
      <span>开发者设置</span>
    </div>

    <el-form ref="form" :model="userKey" label-width="100px" class="profile">
      <el-form-item label="Appid" prop="email">
        <el-input v-model="userKey.access_key" disabled></el-input>
      </el-form-item>
      <el-form-item label="Secret" prop="ticket">
        <el-input v-model="userKey.secret_key" disabled></el-input>
      </el-form-item>

      <el-form-item style="padding-top: 20px">
        <el-button type="primary" @click="viewDocs">查看文档</el-button>
        <el-button type="danger" @click="resetSecret">秘钥重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userKey: {},
    };
  },
  methods: {
    loadInfo() {
      this.$zpan.UserKey.find("default").then((ret) => {
        this.userKey = ret.data;
      });
    },
    viewDocs() {
      open("/swagger/index.html", "blank");
    },
    resetSecret() {
      this.$confirm(this.$t("tips.secret-reset"), this.$t("op.reset") + ` ${this.userKey.name}`, {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        this.$zpan.UserKey.resetSecret("default").then((ret) => {
          this.$message({
            type: "success",
            message: "重置成功!",
          });
          this.loadInfo();
        });
      });
    },
  },
  mounted() {
    this.loadInfo();
  },
};
</script>

<style>
.profile {
  width: 60%;
}
</style>