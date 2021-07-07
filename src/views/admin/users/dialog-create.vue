<template>
  <el-dialog :title="title" :visible.sync="visible" width="35%">
    <el-form :model="form" :rules="rules" ref="form" style="width: 85%">
      <el-form-item prop="email" label="邮箱" label-width="100px">
        <el-input v-model="form.email" placeholder="电子邮箱" autofocus></el-input>
      </el-form-item>
      <el-form-item prop="role" label="角色" label-width="100px">
        <el-select v-model="form.roles" placeholder="请选择用户角色" style="width: 100%">
          <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="storage" label="存储空间" label-width="100px">
        <el-input placeholder="请设置存储配额" v-model="form.storage" style="width: 100%">
          <el-select v-model="unitValue" slot="append" placeholder="单位" style="width: 80px">
            <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" label-width="100px">
        <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="password2" label="密码确认" label-width="100px">
        <el-input type="password" v-model="form.password2" placeholder="密码确认"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t("op.cancel") }}</el-button>
      <el-button size="medium" type="primary" @click="submit">{{ $t("op.confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import utils from "@/libs/utils";
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    title: { type: String, default: "" },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.password2 !== "") {
          this.$refs.form.validateField("password2");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      roles: [
        { label: "管理员", value: "admin" },
        { label: "注册用户", value: "member" },
      ],
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
        ],
        password: [{ validator: validatePass, trigger: "blur", required: true }],
        password2: [{ validator: validatePass2, trigger: "blur", required: true }],
      },
      unitValue: utils.bytesUnits()[2].value,
      form: {
        roles: "member",
        storage: 100,
      },
    };
  },
  computed: {
    units() {
      return utils.bytesUnits();
    },
  },
  methods: {
    submit() {
      this.form.storage_max = Math.round(this.form.storage * this.unitValue);
      this.$zpan.User.signup(this.form).then((ret) => {
        this.finish();
        this.$message({
          type: "success",
          message: this.$t("msg.save-success"),
        });
      });
    },
  },
  mounted() {},
};
</script>

<style>
</style>