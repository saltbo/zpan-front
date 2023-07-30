<template>
  <div>
    <el-dialog :title="$t('dialog.share-title')" :width="shareForm.width" :visible.sync="visible">
      <el-form v-show="!shareForm.done">
        <el-form-item :label="$t('dialog.share-expire-time')" style="margin-left: 20px">
          <el-select v-model="shareForm.expire_sec">
            <el-option :label="`7 ${$t('day')}`" :value="604800"></el-option>
            <el-option :label="`30 ${$t('day')}`" :value="2592000"></el-option>
            <el-option :label="`1 ${$t('year')}`" :value="31536000"></el-option>
            <el-option label="永久" :value="3153600000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('dialog.share-drawcode-switch')" style="margin-left: 20px">
          <el-switch v-model="shareForm.private"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('dialog.share-link-with-pwd')" style="margin-left: 20px">
          <el-switch v-model="shareForm.linkWithPwd" :disabled="!shareForm.private"></el-switch>
        </el-form-item>
      </el-form>

      <div v-show="shareForm.done" style="margin-left: 50px; line-height: 30px">
        <p>
          {{ $t("dialog.share-link") }}：
          <a :href="shareForm.link" target="_blank">{{ shareForm.link }}</a>
        </p>
        <p v-if="shareForm.secret">{{ $t("dialog.share-drawcode") }}：{{ shareForm.secret }}</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="!shareForm.done">
          <el-button @click="close">{{ $t("op.cancel") }}</el-button>
          <el-button type="primary" @click="share">{{ $t("op.confirm") }}</el-button>
        </div>
        <div v-else>
          <el-button type="primary" class="copy-link" :data-clipboard-text="shareTxt" @click="close">{{
            $t("click-copy-link") }}</el-button>
          <el-button @click="close">{{ $t("op.close") }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    alias: String,
  },
  data() {
    return {
      shareForm: {
        done: false,
        width: "30%",
        private: false,
        expire_sec: 604800,
      },
      shareTxt: ""
    };
  },
  methods: {
    share(done) {
      this.$zpan.Share.create(this.shareForm).then((data) => {
        let origin = window.location.origin;
        let alias = data.data.alias;

        this.shareForm.done = true;
        this.shareForm.link = `${origin}/s/${alias}`;
        this.shareForm.secret = data.data.secret;
        if (this.shareForm.linkWithPwd) {
          this.shareForm.link += `?pwd=${this.shareForm.secret}`
        }
        this.shareTxt = `分享链接: ${this.shareForm.link}`
        if (this.shareForm.secret) {
          this.shareTxt += `  提取码: ${this.shareForm.secret}`
        }
      });
    },
  },
  mounted() {
    this.shareForm.matter = this.alias;
  },
};
</script>

<style scoped></style>