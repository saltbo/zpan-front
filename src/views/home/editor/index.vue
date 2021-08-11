<template>
  <v-md-editor v-model="content" :disabled-menus="disabledMenus" right-toolbar="preview toc sync-scroll" @save="onSave" @upload-image="onImageUpload"></v-md-editor>
</template>

<script>
export default {
  data() {
    return {
      fileinfo: {},
      content: "",
    };
  },
  computed: {
    disabledMenus() {
      // 只有能够公共读的存储空间才能使用图片上传功能
      return this.fileinfo.url && new URL(this.fileinfo.url).search ? ["image/upload-image"] : [];
    },
  },
  methods: {
    onImageUpload(event, insertImage, files) {
      console.log(event, insertImage, files);
      let abort;
      const cancel = (c) => {
        abort = c;
      };

      let fo = { file: files[0], filename: files[0].name };
      this.$zpan.File.upload(Number(this.fileinfo.sid), fo, this.fileinfo.parent, cancel).then((data) => {
        insertImage({
          url: data.url,
          desc: data.name,
          // width: 'auto',
          // height: 'auto',
        });
      });
    },
    onSave(text, html) {
      console.log(text);
      let file = new File([text], this.fileinfo.name, { type: this.fileinfo.type });
      this.$zpan.File.save(this.fileinfo.alias, file).then(() => {
        this.$message.success({ message: `保存成功`, offset: 40 });
      });
    },
  },
  mounted() {
    let alias = this.$route.query.alias;
    this.$zpan.File.get(alias).then((ret) => {
      window.document.title = ret.name;
      this.fileinfo = ret;
      this.$axios.get(ret.url).then((ret) => {
        this.content = ret;
      });
    });
  },
};
</script>