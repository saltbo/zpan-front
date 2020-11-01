<template>
  <el-dialog :title="$t('admin.label-storage-change')" :visible.sync="visible">
    <el-form :model="form">
      <el-form-item :label="$t('admin.label-bucket')" label-width="150px">
        <el-input v-model="form.bucket" size="medium"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.label-intro')" label-width="150px">
        <el-input v-model="form.intro" size="medium"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.label-endpoint')" label-width="150px">
        <el-input v-model="form.endpoint" size="medium"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.label-custom_host')" label-width="150px">
        <el-input v-model="form.custom_host" size="medium"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.label-access_key')" label-width="150px">
        <el-input v-model="form.access_key" size="medium"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.label-secret_key')" label-width="150px">
        <el-input v-model="form.secret_key" size="medium"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t("confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { zStorage } from "@/libs/zpan";
import mixinDialog from "@/libs/mixin-dialog.js";
export default {
  mixins: [mixinDialog],
  data() {
    return {
      form: {},
    };
  },
  methods: {
    open(v) {
      this.visible = true;
      this.form = v ? Object.assign({}, v) : {};
    },
    onSubmit() {
      let submit = zStorage.create;
      if (this.form.id) {
        submit = zStorage.update;
      }

      submit(this.form).then((ret) => {
        this.close();
        this.finish();
      });
    },
  },
};
</script>

<style>
</style>