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

      <el-form-item v-show="userKey.access_key" style="padding-top: 20px">
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
      defaultKey: "default",
      userKey: {},
    };
  },
  methods: {
    loadInfo() {
      this.$zpan.UserKey.find(this.defaultKey)
        .then((ret) => {
          this.userKey = ret.data;
        })
        .catch((err) => {
          this.$confirm(this.$t("tips.secret-init"), this.$t("op.init") + `秘钥 ${this.defaultKey}`, {
            type: "warning",
            confirmButtonText: this.$t("op.confirm"),
            cancelButtonText: this.$t("op.cancel"),
          }).then(() => {
            this.$zpan.UserKey.create(this.defaultKey).then((ret) => {
              this.$message({
                type: "success",
                message: `${this.$t("op.init")}${this.$t("msg.success")}`,
              });
              this.loadInfo();
            });
          });
        });
    },
    viewDocs() {
      open("/swagger/index.html", "blank");
    },
    resetSecret() {
      this.$confirm(this.$t("tips.secret-reset"), this.$t("op.reset") + `秘钥 ${this.defaultKey}`, {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        this.$zpan.UserKey.resetSecret("default").then((ret) => {
          this.$message({
            type: "success",
            message: `${this.$t("op.reset")}${this.$t("msg.success")}`,
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