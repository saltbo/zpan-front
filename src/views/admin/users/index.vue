<template>
  <div>
    <div class="topbar">
      <el-input v-model="query.email" @change="listRefresh" size="medium" placeholder="请输入要查找的用户邮箱" prefix-icon="el-icon-search" style="width: 300px"> </el-input>
      <el-button type="primary" size="medium" style="float: right" disabled>添加新用户</el-button>
    </div>

    <el-card shadow="never" style="margin-top: 10px; padding-bottom: 20px">
      <el-table :data="rows" size="medium" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120"> </el-table-column>
        <el-table-column prop="email" label="Email"> </el-table-column>
        <el-table-column prop="role" label="角色" width="120"> </el-table-column>
        <el-table-column prop="status" label="状态" width="120"> </el-table-column>
        <el-table-column prop="storage" label="存储配额" width="220">
          <template slot-scope="scope" width="120">
            <span>{{ scope.row.storage_used }}/{{ scope.row.storage_max }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEdit(scope.$index, scope.row)">调整配额</el-button>
            <!-- <el-button size="mini" type="danger" @click="onDisable(scope.$index, scope.row)">禁用</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-pagination layout="prev, pager, next" :total="50" style="float: right"> </el-pagination>
      </div>
    </el-card>

    <!-- dialog -->
    <el-dialog title="配额调整" :visible.sync="dialogFormVisible" width="25%">
      <el-form :model="form">
        <el-form-item label="配额大小" label-width="120px">
          <el-input-number v-model="form.storage_max" :min="100" size="medium"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onStorageUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { zUser } from "@/libs/zpan";
export default {
  data() {
    return {
      query: {
        email: "",
        offset: 0,
        limit: 20,
      },
      rows: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
    };
  },
  methods: {
    listRefresh() {
      zUser.list(this.query).then((ret) => {
        this.rows = ret.data.list;
        this.total = ret.data.total;
      });
    },
    onEdit(index, row) {
      this.dialogFormVisible = true;
      this.form = row;
    },
    onStorageUpdate() {
      zUser.storageUpdate(this.form.id, this.form.storage_max).then((ret) => {
        this.dialogFormVisible = false;
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