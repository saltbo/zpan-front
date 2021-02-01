<template>
  <div class="guest">
    <el-row style="height: 80px"></el-row>
    <div style="width: 400px; margin: 0 auto">
      <el-card class="box-card" style="padding: 10px 20px">
        <div slot="header">
          <i class="icon el-icon-key"></i>
          <p class="title">找回密码</p>
        </div>

        <el-form :model="formItem" :rules="rules" ref="resetForm">
          <el-form-item prop="email">
            <el-input v-model="formItem.email" placeholder="电子邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button type="primary" @click="reset('resetForm')" style="width: 100%">发送密码重置邮件</el-button>
            </el-row>
            <el-row>
              <el-link type="primary" :underline="false" @click="$router.push({ name: 'signin' })">返回登录</el-link>
            </el-row>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      formItem: {},
    };
  },
  methods: {
    reset(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          return;
        }

        this.$zpan.User.applyPasswordReset(this.formItem.email).then((ret) => {
          this.$message({
            type: "success",
            message: "找回密码邮件发送成功!",
          });
          this.$router.push({ name: "signin" });
        });
      });
    },
  },
};
</script>
