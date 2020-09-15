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
            <span>{{ $t('share.link') }}：</span>
            <a :href="props.row.link" target="_blank">{{props.row.link}}</a>
            <span v-if="props.row.secret" style="margin-left: 20px;">{{ $t('share.drawcode') }}：{{props.row.secret}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('share.name')"></el-table-column>
      <el-table-column prop="created" :label="$t('share.created')">
        <template slot-scope="scope">{{ scope.row.created | moment}}</template>
      </el-table-column>
      <el-table-column prop="expired" :label="$t('share.expired')">
        <template slot-scope="scope">{{ scope.row.expire_at | moment}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { zShare } from "@/libs/zpan";
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
      zShare.list().then((data) => {
        this.tData = data.data.list.map((item) => {
          item.link = `http://${host}/s/${item.alias}`;
          return item;
        });
      });
    },
    onCurrentChange(currentRow, oldCurrentRow) {
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