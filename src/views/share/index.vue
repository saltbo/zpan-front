<style>
/* .el-table__expanded-cell,
.el-table__expanded-cell:hover>td {
	background-color: #ecf5ff !important;
} */
</style>

<template>
  <div>
    <el-table :data="tData" @current-change="onCurrentChange" :expand-row-keys="expandRowKeys" row-key="id" highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>
            链接：
            <a :href="props.row.link" target="_blank">{{props.row.link}}</a>
            <span v-if="props.row.secret" style="margin-left: 20px;">提取码：{{props.row.secret}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="分享文件" prop="name"></el-table-column>
      <el-table-column label="分享时间" prop="created">
        <template slot-scope="scope">{{ scope.row.created | moment}}</template>
      </el-table-column>
      <el-table-column label="失效时间" prop="expired">
        <template slot-scope="scope">{{ scope.row.expire_at | moment}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tData: [],
      expandRowKeys: [],
    };
  },
  methods: {
    listRefresh() {
      let host = window.location.host;
      this.$axios.get("/api/shares").then((ret) => {
        this.tData = ret.data.data.list.map((item) => {
          item.link = `http://${host}/s/${item.alias}`;
          return item;
        });
      });
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      console.log(currentRow, 111);
      this.expandRowKeys = [currentRow.id];
    },
  },
  mounted() {
    this.listRefresh();
  },
};
</script>

<style scoped>
</style>