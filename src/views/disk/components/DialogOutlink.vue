<template>
  <div>
    <el-dialog :title="$t('dialog.outlink-title')" :visible.sync="visible">
      <div>
        <el-input v-model="links" type="textarea" :rows="20"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary">{{ $t('click-copy-link') }}</el-button>
        <el-button @click="visible = false">{{ $t('close') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { zfile } from "@/libs/zpan";
import mixinDialog from "@/libs/mixin-dialog.js";
export default {
  mixins: [mixinDialog],
  data() {
    return {
      links: "",
    };
  },
  methods: {
    open(items) {
      Promise.all(
        items.map((obj) => {
          return zfile.findLink(obj.alias);
        })
      ).then((rets) => {
        rets.forEach((ret) => {
          this.links += ret.link + "\r\n";
        });
      });
      this.visible = true;
    },
  },
};
</script>

<style scoped>
</style>