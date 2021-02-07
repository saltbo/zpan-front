<template>
  <el-card shadow="never" class="box-card">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <el-form ref="form" :model="profile" :rules="rules" label-width="100px" class="profile">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="profile.nickname"></el-input>
      </el-form-item>
      <el-form-item label="个人介绍" prop="bio">
        <el-input type="textarea" v-model="profile.bio"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="profile.url"></el-input>
      </el-form-item>
      <el-form-item label="公司" prop="company">
        <el-input v-model="profile.company"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="location">
        <el-input v-model="profile.location"></el-input>
      </el-form-item>
      <el-form-item label="语言" prop="locale">
        <el-select v-model="profile.locale">
          <el-option v-for="lang in langs" :key="lang.value" :value="lang.value" :label="lang.label">{{ lang.label }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      profile: {},
      rules: {},
      langs: [
        { label: "中文", value: "zh-CN" },
        { label: "English", value: "en" },
      ],
    };
  },
  methods: {
    loadInfo() {
      this.$zpan.User.profileGet().then((ret) => {
        this.profile = ret.data.profile;
      });
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          return;
        }

        this.$zpan.User.updateProfile(this.profile).then((ret) => {
          this.$message({
            type: "success",
            message: "保存成功!",
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