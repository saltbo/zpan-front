<template>
  <div>
    <el-row class="menu">
      <span>提示：回收站不占用网盘空间，文件保存10天后将被自动清除。</span>

      <div style="float: right">
        <el-button type="primary" size="medium" icon="el-icon-delete-solid" @click="clean" plain>{{ $t("disk.clean") }}</el-button>
      </div>
    </el-row>
    <el-table :data="tData" style="width: 100%">
      <el-table-column label="文件名" prop="name"></el-table-column>
      <el-table-column label="大小" prop="size"></el-table-column>
      <el-table-column label="删除时间" prop="created">
        <template slot-scope="scope">{{ scope.row.deleted | moment }}</template>
      </el-table-column>
      <el-table-column label="有效时间" prop="expired">
        <template slot-scope="scope">{{ scope.row.expire_at | moment }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { zRecyclebin } from "@/libs/zpan";
export default {
  data() {
    return {
      tData: [],
    };
  },
  methods: {
    listRefresh() {
      zRecyclebin.list().then((objects) => {
        this.tData = objects;
      });
    },
    clean() {},
  },
  mounted() {
    this.listRefresh();
  },
};
</script>

<style scoped>
</style>