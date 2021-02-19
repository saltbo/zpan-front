<template>
  <div>
    <div class="topbar">
      <el-input v-model="query.email" @change="listRefresh" size="medium" :placeholder="$t('admin.search-placeholder')" prefix-icon="el-icon-search" style="width: 300px"></el-input>
      <el-button type="primary" size="medium" style="float: right" @click="createUser">{{ $t("admin.btn-user-add") }}</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="profile.nickname" :label="$t('admin.label-nickname')" width="120"> </el-table-column>
        <el-table-column prop="email" :label="$t('admin.label-email')"> </el-table-column>
        <el-table-column prop="role" :label="$t('admin.label-role')" width="120"> </el-table-column>
        <el-table-column prop="status" :label="$t('admin.label-status')" width="120"> </el-table-column>
        <el-table-column prop="storage" :label="$t('admin.label-storage')" width="220">
          <template slot-scope="scope" width="120">
            <span>{{ scope.row.storage.used.format() }} / {{ scope.row.storage.max.format() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" :label="$t('admin.label-operation')" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEditStorage(scope.$index, scope.row)">{{ $t("admin.btn-quota-update") }}</el-button>
            <el-button size="mini" @click="onEditPassword(scope.$index, scope.row)">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination layout="prev, pager, next" :current-page.sync="pageNo" :page-size="query.limit" :total="total" @current-change="listRefresh" style="float: right"> </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import utils from "@/libs/utils";
import { transfer } from "@/helper";
import DialogCreate from "./dialog-create";
import DialogStorage from "./dialog-storage";
import DialogPassword from "./dialog-password";
export default {
  data() {
    return {
      query: {
        email: "",
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
      this.$zpan.User.list(this.query).then((ret) => {
        this.rows = ret.data.list.map((ele) => {
          ele.storage.used = utils.formatBytes2(ele.storage.used);
          ele.storage.max = utils.formatBytes2(ele.storage.max);
          return ele;
        });
        this.total = ret.data.total;
      });
    },
    createUser() {
      transfer(DialogCreate)({ title: "添加用户" }).then((data) => {
        this.listRefresh();
      });
    },
    onEditStorage(index, row) {
      let form = Object.assign({}, row.storage);
      let props = { username: row.username, form: form };
      transfer(DialogStorage)(props).then(() => {
        this.listRefresh();
      });
    },
    onEditPassword(index, row) {
      transfer(DialogPassword)({ username: row.username }).then((data) => {
        this.listRefresh();
      });
    },
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