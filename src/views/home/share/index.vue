<style>
/* .el-table__expanded-cell,
.el-table__expanded-cell:hover>td {
	background-color: #ecf5ff !important;
} */
</style>

<template>
  <div>
    <el-row class="th">
      <span class="title">{{ $t("title.share") }}</span>
      <span class="loadtips" style="float: right">{{ loadedtips }}</span>
    </el-row>

    <el-table :data="rows" @current-change="onCurrentChange" :expand-row-keys="expandRowKeys" row-key="id" highlight-current-row style="width: 100%">
      <el-table-column type="expand" width="40">
        <template slot-scope="props">
          <p>
            <span>{{ $t("share.link") }}：</span>
            <a :href="props.row.link" target="_blank">{{ props.row.link }}</a>
            <span v-if="props.row.protected" style="margin-left: 20px">{{ $t("share.drawcode") }}：{{ props.row.secret }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="name">
        <template slot-scope="scope">
          <i v-if="!scope.row.type" class="matter-icon el-icon-folder" style="color: #ffc402"></i>
          <i v-else class="matter-icon el-icon-document"></i>
          <span class="matter-title">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created" :label="$t('share.created')">
        <template slot-scope="scope">{{ scope.row.created | moment }}</template>
      </el-table-column>
      <el-table-column prop="expired" :label="$t('share.expired')">
        <template slot-scope="scope">{{ scope.row.expire_at | moment }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="onDelete(scope.$index, scope.row)">取消分享</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: [],
      total: 0,
      expandRowKeys: [],
    };
  },
  computed: {
    loadedtips() {
      let loadedNum = this.rows.length;
      if (loadedNum == this.total) {
        return `已全部加载，共${this.total}个`;
      }

      return `已加载${loadedNum}个，共${this.total}个`;
    },
  },
  methods: {
    listRefresh() {
      let host = window.location.host;
      this.$zpan.Share.list().then((ret) => {
        let data = ret.data;
        this.rows = data.list.map((item) => {
          item.link = `http://${host}/s/${item.alias}`;
          return item;
        });
        this.total = data.total;
      });
    },
    onDelete(index, row) {
      this.$confirm(this.$t("tips.share-cancel"), this.$t("share.cancel"), {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        this.$zpan.Share.remove(row.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.cancel-success"),
          });
          this.listRefresh();
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
.th {
  font-size: 12px;
  color: #333;
  padding-top: 5px;
}

.matter-icon {
  font-size: 28px;
}

.matter-title {
  display: inline;
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  top: -4px;
  position: relative;
}
</style>