<template>
  <div>
    <el-row class="toolbar">
      <span class="tips">{{ $t("tips.recyclebin") }}</span>
      <div style="float: right">
        <el-button type="primary" size="small" icon="el-icon-delete-solid" @click="clean" plain>{{ $t("recyclebin.clean") }}</el-button>
      </div>
    </el-row>

    <el-row>
      <el-row class="th">
        <span class="title">{{ $t("title.recyclebin") }}</span>
        <span class="loadtips" style="float: right">{{ loadedtips }}</span>
      </el-row>

      <el-table :data="rows" style="width: 100%" highlight-current-row>
        <el-table-column type="selection" width="28"></el-table-column>
        <el-table-column label="文件名" prop="name" min-width="200">
          <template slot-scope="scope">
            <i v-if="scope.row.dirtype" class="matter-icon el-icon-folder" style="color: #ffc402"></i>
            <i v-else class="matter-icon el-icon-document"></i>
            <span class="matter-title">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template slot-scope="scope">
            <div style="float: right; vertical-align: super" class="operation">
              <el-link type="primary" :underline="false">
                <i class="el-icon-refresh-left el-icon--right" @click="onRecovery(scope.row)"></i>
              </el-link>
              <el-link type="primary" :underline="false">
                <i class="el-icon-delete el-icon--right" @click="onTrash(scope.row)"></i>
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="大小" prop="size">
          <template slot-scope="scope">
            <div v-if="scope.row.dirtype">-</div>
            <div v-else>{{ scope.row.size }}</div>
          </template>
        </el-table-column>
        <el-table-column label="删除时间" prop="created">
          <template slot-scope="scope">{{ scope.row.created | moment }}</template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { zRecyclebin } from "@/libs/zpan";
export default {
  data() {
    return {
      rows: [],
      total: 0,
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
      zRecyclebin.list().then((data) => {
        this.rows = data.list;
        this.total = data.total;
      });
    },
    onRecovery(obj) {
      this.$confirm(this.$t("tips.recovery"), this.$t("recyclebin.recovery"), {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        zRecyclebin.recovery(obj.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.recovery-success"),
          });
          this.listRefresh();
        });
      });
    },
    onTrash(obj) {
      this.$confirm(this.$t("tips.delete"), this.$t("recyclebin.delete"), {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        zRecyclebin.delete(obj.alias).then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.delete-success"),
          });
          this.listRefresh();
        });
      });
    },
    clean() {
      this.$confirm(this.$t("tips.clean"), this.$t("recyclebin.clean"), {
        type: "warning",
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      }).then(() => {
        zRecyclebin.clean().then((ret) => {
          this.$message({
            type: "success",
            message: this.$t("msg.clean-success"),
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

<style scoped>
.toolbar {
  height: 45px;
  border-bottom: 1px solid #f2f6fd;
}

.toolbar .tips {
  font-size: 12px;
  color: #8a8989;
}

.th {
  font-size: 12px;
  color: #333;
  padding-top: 5px;
}
.matter-icon {
  font-size: 22px;
}

.matter-title {
  display: inline;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  top: -2px;
  position: relative;
}

.el-table__row .operation {
  display: none;
}
.el-table__row:hover .operation {
  display: block;
}
.operation .el-link {
  font-size: 20px !important;
  margin: 0 2px;
}
</style>