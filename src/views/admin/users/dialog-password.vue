<template>
  <el-dialog :title="$t('admin.label-password-reset')" :visible.sync="visible" width="30%">
    <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px" class="profile" style="width: 85%">
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="密码确认" prop="new_passwordr">
        <el-input v-model="form.passwordr" type="password"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t("op.cancel") }}</el-button>
      <el-button size="medium" type="primary" @click="submit('form')">{{ $t("op.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    username: { type: String },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.new_passwordr !== "") {
          this.$refs.form.validateField("new_passwordr");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.new_password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      form: {},
      rules: {
        password: [{ trigger: "blur", required: true, validator: validatePass }],
        passwordr: [{ trigger: "blur", required: true, validator: validatePass2 }],
      },
    };
  },
  methods: {
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          return;
        }

        this.$zpan.User.updatePasswordByUser(this.username, this.form).then((ret) => {
          this.finish();
          this.$message({
            type: "success",
            message: "修改成功!",
          });
        });
      });
    },
  },
};
</script>

<style>
</style>