<template>
  <el-card shadow="never">
    <div slot="header" class="clearfix">
      <span>系统设置</span>
    </div>

    <el-form ref="form" :model="form" label-width="80px" style="width: 500px">
      <el-form-item label="站点名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="站点描述">
        <el-input v-model="form.intro" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="默认语言">
        <el-select v-model="form.lang" placeholder="请选择系统默认语言">
          <el-option label="中文" value="zh-CN"></el-option>
          <el-option label="英语" value="en"></el-option>
        </el-select>
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
      this.$zpan.System.optSave("website", this.form).then((ret) => {
        this.$message({
          type: "success",
          message: this.$t("msg.save-success"),
        });
      });
    },
  },
  mounted() {
    this.$zpan.System.optGet("website").then((ret) => {
      console.log(ret.data);
      if (ret.data) {
        this.form = ret.data;
      }
    });
  },
};
</script>

<style>
</style>