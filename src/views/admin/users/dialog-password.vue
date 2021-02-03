<template>
  <el-dialog :title="$t('admin.label-password-change')" :visible.sync="visible" width="20%">
    <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px" class="profile" style="width: 85%">
      <el-form-item label="旧密码" prop="old_password">
        <el-input v-model="form.old_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="form.new_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="密码确认" prop="new_passwordr">
        <el-input v-model="form.new_passwordr" type="password"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t("cancel") }}</el-button>
      <el-button size="medium" type="primary" @click="submit('form')">{{ $t("confirm") }}</el-button>
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
        old_password: [{ trigger: "blur", required: true, message: "请输入当前密码" }],
        new_password: [{ trigger: "blur", required: true, validator: validatePass }],
        new_passwordr: [{ trigger: "blur", required: true, validator: validatePass2 }],
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