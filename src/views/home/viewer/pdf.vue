<template>
  <div>
    <link rel="resource" type="application/l10n" href="https://cdn.jsdelivr.net/gh/mozilla/pdf.js@master/l10n/zh-CN/viewer.properties" />
    <vue-pdf-app theme="dark" style="height: 100vh" :pdf="link" :file-name="title" :title="true" :pageScale="100" :config="config" @open="openHandler"></vue-pdf-app>
  </div>
</template>

<script>
import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";
export default {
  components: {
    VuePdfApp,
  },

  data() {
    return {
      title: "",
      link: "",
      config: {
        toolbar: {
          toolbarViewerRight: {
            openFile: false,
            print: false,
          },
        },
      },
    };
  },
  methods: {
    openHandler(pdfApp) {
      pdfApp.setTitle(this.title);
    },
  },
  mounted() {
    this.title = this.$route.query.title;
    this.link = this.$route.query.link;
  },
};
</script>

<style lang="stylus"></style>