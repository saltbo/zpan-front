<template>
  <file-upload ref="upload" v-model="files" :multiple="true" :maximum="50" @input-filter="inputFilter"
    @input-file="inputFile" @update:modelValue="inputUpdate">
    <slot></slot>
  </file-upload>
</template>

<script>
import { mapState } from 'vuex'
import FileUpload from "vue-upload-component";
export default {
  name: 'uploader',
  props: {
    sid: 0,
    dist: "",
  },
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
    };
  },
  watch: {
    files(nv) {
      console.log("files:", nv)
      this.$store.commit('updateFiles', nv)
    },
  },
  methods: {
    upload() {
      // if (!this.$refs.upload.features.directory) {
      //   this.alert("Your browser does not support");
      //   return;
      // }

      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("style", "display: none");
      input.setAttribute("multiple", true);
      // if (obj.type == "folder") {
      //   input.setAttribute("allowdirs", true);
      //   input.setAttribute("directory", true);
      //   input.setAttribute("webkitdirectory", true);
      // }

      document.querySelector("body").appendChild(input);
      input.click();
      input.onchange = (e) => {
        this.$refs.upload.addInputFile(input);
        this.$store.commit('setuListActive', true);
        document.querySelector("body").removeChild(input);
      };
    },
    inputUpdate(files) {
      console.log("inputUpdate", files)
      // this.$store.commit('updateFiles', files)
    },
    inputFilter(newFile, oldFile, prevent) { },
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 获得相应数据
        console.log("response", newFile.response);
        if (newFile.xhr) {
          //  获得响应状态码
          console.log("status", newFile.xhr.status);
          this.$zpan.File.uploadDone(oldFile.matter.alias).then((ret) => {
            this.$store.commit('uploadedCntIncr')
          });
        }
        return;
      }

      if (!newFile && oldFile) {
        // ignore remove event
        return;
      }

      this.$emit("uploadAdded");
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          console.log(newFile, 111)
          this.$zpan.File.create(this.sid, this.dist, newFile).then((ret) => {
            newFile.putAction = ret.data.uplink;
            newFile.headers = ret.data.headers;
            newFile.matter = ret.data.matter;
            this.$refs.upload.$data.active = true
          });
        }
      }
    },
  },
  mounted() {
    console.log("我是mounted钩子");
    this.$watch("$refs.upload.uploaded", (uploaded) => {
      console.log("uploaded", uploaded)
      if (uploaded) {
        setTimeout(() => { this.$emit('uploaded') }, 300)
      }

      this.$store.commit('updateUploading', !uploaded)
    });
  },
  activated() {
    console.log("我是activated钩子");
  },
  deactivated() {
    console.log("我是deactivated钩子");
  },
  beforeDestroy() {
    console.log("我是beforeDestroy钩子");
  },
};
</script>

<style lang="stylus">
</style>