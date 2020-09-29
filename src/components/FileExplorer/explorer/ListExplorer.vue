<template>
  <el-table style="width: 100%" tooltip-effect="dark" :data="data" v-loading="loading" highlight-current-row @selection-change="onSelectionChange">
    <el-table-column type="selection" width="30" :selectable="onSelectable"></el-table-column>
    <el-table-column prop="name" :label="$t('fth.name')" min-width="200" show-overflow-tooltip sortable>
      <template slot-scope="scope">
        <i v-if="scope.row.dirtype" class="matter-icon el-icon-folder" style="color: #ffc402"></i>
        <i v-else class="matter-icon el-icon-document"></i>
        <el-link :underline="false" class="matter-title" href="Javascript: void(0);">
          <span @click="onNameClick(scope.row)">{{ scope.row.name }}</span>
        </el-link>
      </template>
    </el-table-column>
    <el-table-column width="150">
      <template slot-scope="scope">
        <div style="float: right; vertical-align: super" class="operation">
          <el-link v-for="item in rowButtons" :key="item.name" v-show="!item.shown || item.shown(scope.row)" type="primary" :underline="false">
            <i :class="`${item.icon} el-icon--right`" @click="item.action(scope.row)"></i>
          </el-link>

          <el-dropdown v-show="moreButtons && moreButtons.length > 0" trigger="click" @command="handleCommand">
            <el-link type="primary" class="el-dropdown-link" :underline="false">
              <i class="el-icon-more el-icon--right"></i>
            </el-link>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in moreButtons" :key="item.name" :command="{ action: item.action, row: scope.row }">
                {{ item.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="size" :label="$t('fth.size')" width="180">
      <template slot-scope="scope">
        <div v-if="scope.row.dirtype">-</div>
        <div v-else>{{ scope.row.size }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="updated" :label="$t('fth.updated')" width="180">
      <template slot-scope="scope">{{ scope.row.updated | moment }}</template>
    </el-table-column>
  </el-table>
</template>

<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {
    onSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    onSelectable(row, index) {
      if (!row.dirtype) return true;
    },
    handleCommand(command) {
      command.action(command.row);
    },
  },
};
</script>

<style scoped>
.matter-icon {
  font-size: 35px;
}
.matter-title {
  display: inline;
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  top: -8px;
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