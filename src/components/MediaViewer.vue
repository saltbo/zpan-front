<template>
  <el-dialog :title="value.name" :visible.sync="show" width="30%" @opened="onOpen" @close="onClose">
    <vue-plyr ref="audio" v-show="mediatype=='audio'">
      <audio :src="value.url"></audio>
    </vue-plyr>

    <vue-plyr ref="video" v-show="mediatype=='video'">
      <video :src="value.url"></video>
    </vue-plyr>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: Object,
    visible: {
      type: Boolean,
      default: false,
    },
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
      return this.value.type ? this.value.type : "";
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