<template>
  <div class="guest">
    <el-row style="height: 80px"></el-row>
    <div style="width: 400px; margin: 0 auto">
      <el-card class="box-card" style="padding: 10px 20px">
        <div slot="header">
          <i class="icon el-icon-lock"></i>
          <p class="title">用户登录</p>
        </div>

        <el-form ref="formItem" :model="formItem" :rules="rules">
          <el-form-item prop="email">
            <el-input v-model="formItem.email" placeholder="用户名或邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formItem.password" type="password" placeholder="密码" @keyup.enter.native="signIn('formItem')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button type="primary" @click="signIn('formItem')" style="width: 100%">登录</el-button>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-link type="primary" :underline="false" @click="goto('reset_apply')">忘记密码</el-link>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-link type="primary" :underline="false" @click="goto('signup')">注册账号</el-link>
              </el-col>
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
        email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" }],
      },
      redirect: "/",
      formItem: {
        email: "",
      },
    };
  },
  methods: {
    goto(name) {
      this.$router.push({ name: name });
    },
    signIn(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          return;
        }

        this.$zpan.User.signin(this.formItem)
          .then((ret) => {
            location.replace(this.redirect);
          })
          .catch((err) => {
            console.log(err.response);
            // todo 判断如果账户未激活则提示是否重发邮件，调用重发邮件接口帮助用户重新激活账户
          });
      });
    },
  },
  mounted() {
    if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect;
    }
    if (this.$route.params.email) {
      this.formItem.email = this.$route.params.email;
    }
  },
};
</script>
