<template>
  <el-dialog :title="title" :visible.sync="show" width="30%" @opened="onOpen" @close="onClose">
    <vue-plyr ref="audio" v-show="mediatype == 'audio'">
      <audio :src="url"></audio>
    </vue-plyr>

    <vue-plyr ref="video" v-show="mediatype == 'video'">
      <video :src="url"></video>
    </vue-plyr>
  </el-dialog>
</template>

<script>
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  props: {
    title: String,
    type: String,
    url: String,
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    visible(n, o) {
      this.show = n;
    },
  },
  methods: {
    onOpen() {
      this.player.play();
    },
    onClose() {
      this.$emit("close");
      console.log(this.player);
      this.player.stop();
    },
  },
  computed: {
    filetype() {
      return this.type ? this.type : "";
    },
    mediatype() {
      return this.filetype.split("/")[0];
    },
    player() {
      return this.$refs[this.mediatype].player;
    },
  },
};
</script>

<style>
</style>