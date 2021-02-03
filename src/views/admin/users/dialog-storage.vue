<template>
  <el-dialog :title="$t('admin.label-quota-change')" :visible.sync="visible" width="20%">
    <el-form :model="form">
      <el-form-item :label="$t('admin.label-quota')" label-width="110px">
        <el-input placeholder="请输入内容" v-model="form.max.num" style="width: 80%">
          <el-select v-model="form.max.unitValue" slot="append" placeholder="单位" style="width: 80px">
            <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t("cancel") }}</el-button>
      <el-button size="medium" type="primary" @click="onSubmit">{{ $t("confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import utils from "@/libs/utils";
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    username: { type: String },
    form: { type: Object },
  },
  data() {
    return {};
  },
  computed: {
    units() {
      return utils.bytesUnits();
    },
  },
  methods: {
    onSubmit() {
      this.form.max = Math.round(this.form.max.num * this.form.max.unitValue);
      this.$zpan.User.updateStorageByUser(this.username, this.form).then((ret) => {
        this.finish();
        this.$message({
          type: "success",
          message: this.$t("msg.save-success"),
        });
      });
    },
  },
  mounted() {},
};
</script>

<style>
</style>