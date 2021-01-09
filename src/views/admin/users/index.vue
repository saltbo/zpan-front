<template>
  <div>
    <div class="topbar">
      <el-input v-model="query.email" @change="listRefresh" size="medium" :placeholder="$t('admin.search-placeholder')" prefix-icon="el-icon-search" style="width: 300px"></el-input>
      <el-button type="primary" size="medium" style="float: right" disabled>{{ $t("admin.btn-user-add") }}</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="nickname" :label="$t('admin.label-nickname')" width="120"> </el-table-column>
        <el-table-column prop="email" :label="$t('admin.label-email')"> </el-table-column>
        <el-table-column prop="role" :label="$t('admin.label-role')" width="120"> </el-table-column>
        <el-table-column prop="status" :label="$t('admin.label-status')" width="120"> </el-table-column>
        <el-table-column prop="storage" :label="$t('admin.label-storage')" width="220">
          <template slot-scope="scope" width="120">
            <span>{{ scope.row.storage_used }} / {{ scope.row.storage_max }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" :label="$t('admin.label-operation')" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEdit(scope.$index, scope.row)">{{ $t("admin.btn-quota-update") }}</el-button>
            <!-- <el-button size="mini" type="danger" @click="onDisable(scope.$index, scope.row)">禁用</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination layout="prev, pager, next" :current-page.sync="pageNo" :page-size="query.limit" :total="total" @current-change="listRefresh" style="float: right"> </el-pagination>
      </div>
    </el-card>

    <!-- dialog -->
    <el-dialog :title="$t('admin.label-quota-change')" :visible.sync="dialogFormVisible" width="20%">
      <el-form :model="form">
        <el-form-item :label="$t('admin.label-quota')" label-width="110px">
          <!-- <el-input-number v-model="form.storage_max" :min="100" size="medium"></el-input-number> -->
          <el-select v-model="form.storage_max" placeholder="请选择用户配额">
            <el-option v-for="item in storageQuotas" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="onStorageUpdate">{{ $t("confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { zUser } from "@/libs/zpan";
import utils from "@/libs/utils";
export default {
  data() {
    const MB = 1024 * 1024;
    const GB = 1024 * MB;
    const TB = 1024 * GB;
    return {
      query: {
        email: "",
        offset: 0,
        limit: 20,
      },
      pageNo: 1,
      rows: [],
      total: 0,
      dialogFormVisible: false,
      storageQuotas: [
        { label: "100 MB", value: 100 * MB },
        { label: "512 MB", value: 512 * MB },
        { label: "1 GB", value: 1 * GB },
        { label: "10 GB", value: 10 * GB },
        { label: "50 GB", value: 50 * GB },
        { label: "100 GB", value: 100 * GB },
        { label: "1 TB", value: 1 * TB },
        { label: "10 TB", value: 10 * TB },
      ],
      form: {},
    };
  },
  methods: {
    listRefresh() {
      this.query.offset = (this.pageNo - 1) * this.query.limit;
      zUser.list(this.query).then((ret) => {
        this.rows = ret.data.list;
        this.rows = this.rows.map((ele) => {
          ele.storage_used = utils.formatBytes(ele.storage_used);
          ele.storage_max = utils.formatBytes(ele.storage_max);
          return ele;
        });
        this.total = ret.data.total;
      });
    },
    onEdit(index, row) {
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    onStorageUpdate() {
      zUser.storageUpdate(this.form.id, this.form.storage_max).then((ret) => {
        this.dialogFormVisible = false;
        this.listRefresh();
        this.$message({
          type: "success",
          message: this.$t("msg.save-success"),
        });
      });
    },
    onDisable(index, row) {},
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