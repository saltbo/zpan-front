<template>
  <div>
    <el-dialog title="移动到" width="30%" :visible.sync="visible">
      <el-tree :data="data" :props="props" node-key="id" :default-expanded-keys="[0]" :load="loadNode" :highlight-current="true" @current-change="onCurrentChange" lazy>
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>
            <i class="el-icon-folder"></i>
            {{ node.label }}
          </span>
        </span>
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { zfile, zfolder } from "@/libs/zpan";
import mixinDialog from "@/libs/mixin-dialog.js";
export default {
  mixins: [mixinDialog],
  data() {
    return {
      data: [],
      props: {
        label: "name",
        children: "folders",
        isLeaf: "leaf",
      },
      alias: "",
      current: {},
    };
  },
  methods: {
    open(obj) {
      this.alias = obj.alias;

      this.loadRootForlders();
      this.visible = true;
    },
    onCurrentChange(item, node) {
      console.log(item);
      this.current = item;
    },
    loadRootForlders() {
      zfolder.list({ parent: "" }).then((objects) => {
        this.data = [{ id: 0, name: "/", parent: "", folders: objects }];
      });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return;
      }

      zfolder.list({ parent: node.data.fullpath }).then(resolve);
    },
    submit() {
      zfile.move(this.alias, this.current.fullpath).then((ret) => {
        this.$message({
          type: "success",
          message: "文件移动成功!",
        });
        this.finish();
        this.close();
      });
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  font-size: 22px;
  line-height: 25px;
}
.el-icon-folder {
  color: #ffc402;
}
</style>
 No newline at end of file
