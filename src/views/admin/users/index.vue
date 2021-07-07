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
        <el-table-column prop="role" :label="$t('admin.label-role')" width="100"> </el-table-column>
        <el-table-column prop="status" :label="$t('admin.label-status')" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '已激活'" type="success">{{ scope.row.status }}</el-tag>
            <el-tag v-else type="info">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storage" :label="$t('admin.label-storage')" width="220">
          <template slot-scope="scope" width="120">
            <span>{{ scope.row.storage.used.format() }} / {{ scope.row.storage.max.format() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" :label="$t('admin.label-operation')" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="onStatusSwitch(scope.$index, scope.row)">{{ $t(`op.${scope.row.status == "已激活" ? "disable" : "enable"}`) }}</el-button>
            <el-dropdown
              style="margin-left: 10px"
              @command="
                (cmd) => {
                  onDropdownMenuClick(cmd, scope.row);
                }
              "
            >
              <el-button size="mini">高级<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit-storage">{{ $t("admin.btn-quota-update") }}</el-dropdown-item>
                <el-dropdown-item command="reset-password">重置密码</el-dropdown-item>
                <el-dropdown-item command="remove" divided>{{ $t("op.delete") }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    onStatusSwitch(index, row) {
      const ENABLE = 1;
      const DISABLE = 2;
      let form = Object.assign({}, row);
      let op = this.$t("op.enable");
      let msg = op + this.$t("msg.success");
      let tips = this.$t("tips.enable");
      if (row.status == "已禁用") {
        form.status = ENABLE;
      } else {
        form.status = DISABLE;
        op = this.$t("op.disable");
        msg = op + this.$t("msg.success");
        tips = this.$t("tips.disable");
      }

      this.$confirm(tips, `${op} ${row.email}`, {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        this.$zpan.User.updateStatusByUser(row.username, form).then((ret) => {
          this.$message({
            type: "success",
            message: msg,
          });
          this.listRefresh();
        });
      });
    },
    onDropdownMenuClick(command, row) {
      switch (command) {
        case "edit-storage":
          this.onEditStorage(row);
          break;
        case "reset-password":
          this.onEditPassword(row);
          break;
        case "remove":
          this.onDelete(row);
          break;
        default:
          break;
      }
      console.log(command);
    },
    onEditStorage(row) {
      let form = Object.assign({}, row.storage);
      let props = { username: row.username, form: form };
      transfer(DialogStorage)(props).then(() => {
        this.listRefresh();
      });
    },
    onEditPassword(row) {
      transfer(DialogPassword)({ username: row.username }).then((data) => {
        this.listRefresh();
      });
    },
    onDelete(row) {
      this.$confirm(this.$t("tips.remove"), this.$t("op.delete") + ` ${row.email}`, {
        type: "warning",
        confirmButtonText: this.$t("op.confirm"),
        cancelButtonText: this.$t("op.cancel"),
      }).then(() => {
        this.$zpan.User.delete(row.username).then((ret) => {
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
.topbar {
}
</style>