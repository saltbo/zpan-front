<template>
  <div>
    <el-dialog title="分享链接" :width="shareForm.width" :visible.sync="visible">
      <el-form v-show="!shareForm.done">
        <el-form-item label="使用提取码保护链接" style="margin-left: 20px;">
          <el-switch v-model="shareForm.private"></el-switch>
        </el-form-item>
        <el-form-item label="有效期" style="margin-left: 20px;">
          <el-select v-model="shareForm.expire_sec">
            <el-option label="7天" :value="604800"></el-option>
            <el-option label="30天" :value="2592000"></el-option>
            <el-option label="一年" :value="31536000"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div v-show="shareForm.done" style="margin-left: 50px; line-height: 30px;">
        <p>
          链接地址：
          <a :href="shareForm.link" target="_blank">{{shareForm.link}}</a>
        </p>
        <p v-if="shareForm.secret">提取码：{{shareForm.secret}}</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="!shareForm.done">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="share">确 定</el-button>
        </div>
        <div v-else>
          <el-button type="primary">点击复制链接</el-button>
          <el-button @click="visible = false">关 闭</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixinDialog from "@/libs/mixin-dialog.js";
import { zShare } from "@/libs/zpan";
export default {
  name: "Share",
  mixins: [mixinDialog],
  data() {
    return {
      shareForm: {
        done: false,
        width: "30%",
        mid: 0,
        private: false,
        expire_sec: 604800,
      },
    };
  },
  methods: {
    open(alias) {
      this.shareForm.matter = alias;
      this.visible = true;
    },
    share(done) {
      zShare.create(this.shareForm).then((data) => {
        let host = window.location.host;
        let alias = data.data.alias;

        this.shareForm.done = true;
        this.shareForm.width = "50%";
        this.shareForm.link = `http://${host}/s/${alias}`;
        this.shareForm.secret = data.data.secret;
      });
    },
  },
};
</script>

<style scoped>
</style>