<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>发信邮箱设置</span>
    </div>

    <el-form ref="form" :model="form" label-width="100px" style="width: 520px">
      <el-form-item label="SMTP地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="发信人">
        <el-input v-model="form.sender"></el-input>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled"></el-switch>
        <span class="tips"><i class="el-icon-warning"></i>开启后可以使用完整账户流程（邮箱验证，找回密码）</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  methods: {
    onSubmit() {
      this.$zpan.System.optSave("core.email", this.form).then((ret) => {
        this.$message({
          type: "success",
          message: this.$t("msg.save-success"),
        });
      });
    },
  },
  mounted() {
    this.$zpan.System.optGet("core.email").then((ret) => {
      console.log(ret.data);
      if (ret.data) {
        this.form = ret.data;
      }
    });
  },
};
</script>

<style>
.tips {
  margin: 0 10px;
  color: #979696;
}
.tips i {
  padding: 0 2px;
}
</style>