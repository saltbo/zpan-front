<template>
  <el-card shadow="never">
    <el-form ref="form" :model="form" label-width="80px" style="width: 500px">
      <el-form-item label="站点名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="form.region" placeholder="请选择系统语言">
          <el-option label="中文" value="shanghai"></el-option>
          <el-option label="英语" value="beijing"></el-option>
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
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style>
</style>