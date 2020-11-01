<template>
  <div>
    <div class="topbar">
      <el-input v-model="query.email" @change="listRefresh" size="medium" :placeholder="$t('admin.storage-search-placeholder')" prefix-icon="el-icon-search" style="width: 300px"></el-input>
      <el-button type="primary" size="medium" style="float: right" @click="onCreate">{{ $t("admin.btn-storage-add") }}</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="name" :label="$t('admin.label-name')"> </el-table-column>
        <el-table-column prop="intro" :label="$t('admin.label-intro')"> </el-table-column>
        <el-table-column prop="bucket" :label="$t('admin.label-bucket')" width="150"> </el-table-column>
        <el-table-column prop="endpoint" :label="$t('admin.label-endpoint')" width="320"> </el-table-column>
        <el-table-column prop="custom_host" :label="$t('admin.label-custom_host')" width="220"> </el-table-column>
        <el-table-column prop="operation" :label="$t('admin.label-operation')" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEdit(scope.$index, scope.row)">{{ $t("admin.btn-edit") }}</el-button>
            <el-button size="mini" type="danger" @click="onDelete(scope.$index, scope.row)">{{ $t("delete") }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination layout="prev, pager, next" :current-page.sync="pageNo" :page-size="query.limit" :total="total" @current-change="listRefresh" style="float: right"> </el-pagination>
      </div>
    </el-card>

    <EditDialog ref="editDialog" @completed="listRefresh" />
  </div>
</template>

<script>
import { zStorage } from "@/libs/zpan";
import EditDialog from "./dialog-edit";
export default {
  components: {
    EditDialog,
  },
  data() {
    return {
      query: {
        name: "",
        offset: 0,
        limit: 20,
      },
      pageNo: 1,
      rows: [],
      total: 0,
    };
  },
  methods: {
    listRefresh() {
      this.query.offset = (this.pageNo - 1) * this.query.limit;
      zStorage.list(this.query).then((ret) => {
        this.rows = ret.data.list;
        this.total = ret.data.total;
      });
    },
    onCreate() {
      this.$refs.editDialog.open();
    },
    onEdit(index, row) {
      this.$refs.editDialog.open(row);
    },
    onDelete(index, row) {
      this.$confirm(this.$t("tips.remove"), this.$t("delete") + ` ${row.name}`, {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        zStorage.delete(row.id).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.delete-success"),
          });
          this.listRefresh();
        });
      });
    },
  },
  mounted() {
    this.listRefresh();
  },
};
</script>

<style>
</style>