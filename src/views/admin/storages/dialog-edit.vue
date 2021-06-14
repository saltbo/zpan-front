<template>
  <el-drawer :title="$t('admin.label-storage-manager')" :visible.sync="visible" :wrapperClosable="false" size="50%">
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
          <el-form-item prop="provider" label="云平台" label-width="120px">
            <el-select v-model="form.provider" placeholder="请选择您的云平台" :disabled="editMode" @change="refreshEplist" style="width: 100%">
              <el-option v-for="item in providers" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="bucket" :label="$t('admin.label-bucket')" label-width="120px">
            <el-input v-model="form.bucket" placeholder="请输入存储桶名称" :disabled="editMode"></el-input>
          </el-form-item>
          <el-form-item prop="endpoint" :label="$t('admin.label-endpoint')" label-width="120px">
            <el-autocomplete v-model="form.endpoint" :fetch-suggestions="endpointSearch" @select="endpointSelect" placeholder="请输入接入点" style="width: 100%"></el-autocomplete>
          </el-form-item>
          <el-form-item prop="region" :label="$t('admin.label-region')" v-show="form.provider == 'MINIO'" label-width="120px">
            <el-input v-model="form.region" placeholder="请输入接入点对应的区域名称"></el-input>
          </el-form-item>
          <el-form-item prop="access_key" :label="$t('admin.label-access_key')" label-width="120px">
            <el-input v-model="form.access_key" placeholder="请输入用来操作存储桶的AK"></el-input>
          </el-form-item>
          <el-form-item prop="secret_key" :label="$t('admin.label-secret_key')" label-width="120px">
            <el-input v-model="form.secret_key" placeholder="请输入用来操作存储桶的SK" type="password"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="高级配置" name="storage">
          <el-form-item prop="title" :label="$t('admin.label-title')" label-width="120px">
            <el-input v-model="form.title" placeholder="设置导航栏标题，默认使用存储名称"></el-input>
          </el-form-item>
          <el-form-item prop="custom_host" :label="$t('admin.label-custom_host')" label-width="120px">
            <el-input v-model="form.custom_host" placeholder="设置存储桶绑定的自定义域名，默认使用Endpoint"></el-input>
          </el-form-item>
          <el-form-item prop="root_path" label="存储根路径" label-width="120px">
            <el-input v-model="form.root_path" placeholder="设置文件存储规则，不填则默认为Bucket根路径"></el-input>
          </el-form-item>
          <el-form-item prop="file_path" label="文件存储路径" label-width="120px">
            <el-input v-model="form.file_path" placeholder="设置文件存储规则，不填则使用系统默认规则"></el-input>
            <span class="tips" @click="openEnvs"><i class="el-icon-warning"></i>支持的系统变量</span>
          </el-form-item>
          <!-- <el-form-item prop="idirs" label="系统目录" label-width="120px">
            <el-select v-model="form.internal_dirs" multiple filterable allow-create default-first-option style="width: 100%" placeholder="设置系统内置目录，这些目录不允许用户删除">
              <el-option v-for="item in form.internal_dirs" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item> -->
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="onSubmit">{{ $t("confirm") }}</el-button>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
    </div>

    <!-- 系统变量提示 -->
    <el-drawer title="支持的系统变量" :append-to-body="true" :visible.sync="envDrawerVisible" size="35%">
      <el-table :data="support_envs" size="small" style="padding: 10px 20px">
        <el-table-column property="name" label="变量" width="150"></el-table-column>
        <el-table-column property="intro" label="介绍" width="150"></el-table-column>
        <el-table-column property="example" label="例子"></el-table-column>
      </el-table>
    </el-drawer>
  </el-drawer>
</template>

<script>
import yamlLoader from "js-yaml";
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          mode: 1,
          endpoint: "",
          region: "auto",
        };
      },
    },
  },
  data() {
    return {
      providers: [],
      endpoints: [],
      envDrawerVisible: false,
      support_envs: [],
      rules: {
        name: [
          { required: true, message: "请输入存储名称", trigger: "blur" },
          { pattern: /^[A-Za-z0-9\-]+$/, message: "仅允许使用字母数字和中线(-)", trigger: "blur" },
        ],
        provider: [{ required: true, message: "请选择云平台", trigger: "change" }],
        bucket: [{ required: true, message: "请填写存储桶名称", trigger: "blur" }],
        endpoint: [
          { required: true, message: "请填写Endpoint", trigger: "blur" },
          { pattern: /^((?!\d+\.\d+\.\d+\.\d).)+$/, message: "Endpoint不支持使用IP", trigger: "change" },
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
    openEnvs() {
      this.envDrawerVisible = true;
      this.$zpan.System.matterPathEnvs().then((ret) => {
        this.support_envs = ret.data;
      });
    },
    refreshEplist(provider) {
      this.form.endpoint = ""; // reset the endpoint
      this.form.region = ""; // reset the region

      provider = provider.toLowerCase();
      this.$axios
        .get(`https://raw.githubusercontent.com/eplist/eplist/main/${provider}.yml`)
        .then((data) => {
          let eplist = yamlLoader.load(data);
          this.endpoints = eplist.endpoints;
        })
        .catch((err) => {
          this.endpoints = [];
        });
    },
    endpointSearch(queryString, cb) {
      if (queryString != "" && this.form.provider.toLowerCase() == "minio") {
        cb([{ value: queryString, region: "auto" }]);
        return;
      }

      var endpoints = this.endpoints.map((item) => {
        return { value: item.endpoint, region: item.region };
      });
      var results = queryString ? endpoints.filter(this.createEndpointFilter(queryString)) : endpoints;
      cb(results);
    },
    createEndpointFilter(queryString) {
      return (ep) => {
        return ep.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1;
      };
    },
    endpointSelect(ep) {
      this.form.region = ep.region;
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

        // this.form.idirs = this.form.internal_dirs.join(",");
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
  mounted() {
    this.$zpan.System.providers().then((ret) => {
      this.providers = ret.data;
    });
  },
};
</script>

<style lang="stylus" >
.el-drawer__body
  overflow: auto;

.footer
  margin-left: 142px;
  margin-top: 25px;
</style>