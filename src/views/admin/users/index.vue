<template>
  <div>
    <div class="topbar">
      <el-input v-model="searchKw" size="medium" placeholder="要查找的用户" prefix-icon="el-icon-search" style="width: 300px"> </el-input>
      <el-button type="primary" size="medium" style="float: right">添加新用户</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="name" label="昵称" width="180"> </el-table-column>
        <el-table-column prop="email" label="Email" width="180"> </el-table-column>
        <el-table-column prop="role" label="角色"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column prop="storage" label="存储配额"> </el-table-column>
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
export default {
  data() {
    return {
      searchKw: "",
      rows: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    onEdit(index, row) {},
    onDelete(index, row) {},
  },
};
</script>

<style>
.topbar {
}
</style>