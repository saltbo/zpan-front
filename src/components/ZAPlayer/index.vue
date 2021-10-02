<template>
  <aplayer :music.sync="current" :key="current.alias" :list="alist" autoplay />
</template>

<script>
import Aplayer from "vue-aplayer";
export default {
  components: {
    Aplayer,
  },
  data() {
    return {
      current: {
        // title: "secret base~君がくれたもの~",
        // artist: "Silent Siren",
        // src: "http://test.minio.localhost:9000/20210816/FOVRDQBrxSO6mgMI.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20210815%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20210815T160657Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3Bfilename%3D%22%25E9%2598%25BF%25E6%259C%25A8%25E5%25AE%2587%25E6%25A2%2585%2B-%2B%25E7%25BB%2593%25E6%259E%259C.mp3%22&X-Amz-Signature=b075e4c4e613cec2efe42943fb161fe807f702a2203a2309796f1a87ca77e15f",
        // pic: "https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg",
      },
      alist: [],
    };
  },
  methods: {
    audioExist(obj) {
      return this.alist.some((ele) => {
        return ele.alias == obj.alias;
      });
    },
    play(obj, link) {
      this.current = { alias: obj.alias, title: obj.name, src: link };

      if (!this.audioExist(obj)) {
        this.alist.push(Object.assign({}, this.current));
      }
    },
  },
  mounted() {},
};
</script>

<style>
</style>