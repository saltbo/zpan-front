<template>
  <el-dialog :title="$t('admin.label-storage-manager')" width="30%" :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="form" style="padding-right: 50px" size="small">
      <el-tabs value="basic" type="card" style="margin-left: 20px">
        <el-tab-pane label="基础配置" name="basic">
          <el-form-item label="类型" label-width="120px">
            <el-radio-group v-model="form.mode" :disabled="editMode">
              <el-radio :label="1">网盘</el-radio>
              <el-radio :label="2">外链盘</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="name" :label="$t('admin.label-name')" label-width="120px">
            <el-input v-model="form.name" placeholder="请输入一个名字" autofocus></el-input>
          </el-form-item>
          <el-form-item prop="title" :label="$t('admin.label-title')" label-width="120px">
            <el-input v-model="form.title" placeholder="请设置一个标题，会显示在导航栏"></el-input>
          </el-form-item>
          <el-form-item prop="idirs" label="系统目录" label-width="120px">
            <el-select v-model="form.internal_dirs" multiple filterable allow-create default-first-option style="width: 100%" placeholder="设置系统内置目录，这些目录不允许用户删除">
              <el-option v-for="item in form.internal_dirs" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="云平台配置" name="storage">
          <el-form-item prop="provider" label="云平台" label-width="120px">
            <el-select v-model="form.provider" placeholder="请选择您的云平台" :disabled="editMode">
              <el-option v-for="item in providers" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bucket" :label="$t('admin.label-bucket')" label-width="120px">
            <el-input v-model="form.bucket" :disabled="editMode"></el-input>
          </el-form-item>
          <el-form-item prop="endpoint" :label="$t('admin.label-endpoint')" label-width="120px">
            <el-input v-model="form.endpoint" :disabled="editMode"></el-input>
          </el-form-item>
          <el-form-item prop="access_key" :label="$t('admin.label-access_key')" label-width="120px">
            <el-input v-model="form.access_key"></el-input>
          </el-form-item>
          <el-form-item prop="secret_key" :label="$t('admin.label-secret_key')" label-width="120px">
            <el-input v-model="form.secret_key" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="custom_host" :label="$t('admin.label-custom_host')" label-width="120px">
            <el-input v-model="form.custom_host"></el-input>
          </el-form-item>
          <el-form-item prop="root_path" label="根路径" label-width="120px">
            <el-input v-model="form.root_path" placeholder="默认为Bucket根路径"></el-input>
          </el-form-item>
          <el-form-item prop="file_path" label="文件路径" label-width="120px">
            <el-input v-model="form.file_path" placeholder="默认为YYYYMMDD/UUID.ext"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t("confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mixinDialog from "@/libs/mixin-dialog.js";
export default {
  mixins: [mixinDialog],
  data() {
    return {
      providers: [],
      form: {},
      rules: {
        name: [
          { required: true, message: "请输入存储名称", trigger: "blur" },
          { pattern: /^[A-Za-z]+$/, message: "仅允许使用英文单词", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        provider: [{ required: true, message: "请选择云平台", trigger: "change" }],
        bucket: [{ required: true, message: "请填写存储桶名称", trigger: "blur" }],
        endpoint: [
          { required: true, message: "请填写Endpoint", trigger: "blur" },
          // fixme: 这个规则不完美，漏掉了ip，应该是不允许使用IP的
          { pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, message: "Endpoint只包含域名", trigger: "blur" },
        ],
        access_key: [{ required: true, message: "请填写AccessKey", trigger: "blur" }],
        secret_key: [{ required: true, message: "请填写SecretKey", trigger: "blur" }],
      },
    };
  },
  computed: {
    editMode() {
      return this.form.id > 0;
    },
  },
  methods: {
    open(v) {
      this.$zpan.System.providers().then((ret) => {
        this.providers = ret.data;
      });

      this.visible = true;
      this.form = v ? Object.assign({}, v) : { mode: 1, idirs: ["aaa"] };
      this.form.internal_dirs = this.form.idirs.split(",");
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }

        let submit = this.$zpan.Storage.create;
        if (this.form.id) {
          submit = this.$zpan.Storage.update;
        }

        this.form.idirs = this.form.internal_dirs.join(",");
        submit(this.form).then((ret) => {
          this.close();
          this.finish();
          this.$message({
            type: "success",
            message: this.$t("msg.save-success"),
          });
        });
      });
    },
  },
};
</script>

<style>
</style>