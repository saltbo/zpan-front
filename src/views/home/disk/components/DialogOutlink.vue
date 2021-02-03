<template>
  <div>
    <el-dialog :title="$t('dialog.outlink-title')" :visible.sync="visible">
      <div>
        <el-input v-model="links" type="textarea" :rows="20"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary">{{ $t("click-copy-link") }}</el-button>
        <el-button @click="visible = false">{{ $t("close") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    items: Array,
  },
  data() {
    return {
      links: "",
    };
  },
  methods: {
    loadLinks() {
      Promise.all(
        this.items.map((obj) => {
          return this.$zpan.File.findLink(obj.alias);
        })
      ).then((rets) => {
        rets.forEach((ret) => {
          this.links += ret.link + "\r\n";
        });
      });
    },
  },
  mounted() {
    this.loadLinks();
  },
};
</script>

<style scoped>
</style>