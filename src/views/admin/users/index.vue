<template>
  <div>
    <div class="topbar">
      <el-input v-model="searchKw" size="medium" placeholder="要查找的用户" prefix-icon="el-icon-search" style="width: 300px"> </el-input>
      <el-button type="primary" size="medium" style="float: right">添加新用户</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="nickname" label="昵称" width="180"> </el-table-column>
        <el-table-column prop="email" label="Email" width="180"> </el-table-column>
        <el-table-column prop="role" label="角色"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="storage" label="存储配额">
          <template slot-scope="scope">
            <span>{{ scope.row.storage_used }}/ {{ scope.row.storage_max }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="onDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination layout="prev, pager, next" :total="50" style="float: right"> </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { zUser } from "@/libs/zpan";
export default {
  data() {
    return {
      searchKw: "",
      rows: [],
      total: 0,
    };
  },
  methods: {
    listRefresh() {
      zUser.list().then((ret) => {
        this.rows = ret.data.list;
        this.total = ret.data.total;
      });
    },
    onEdit(index, row) {},
    onDelete(index, row) {},
  },
  mounted() {
    this.listRefresh();
  },
};
</script>

<style>
.topbar {
}
</style>