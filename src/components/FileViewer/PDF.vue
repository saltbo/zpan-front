<template>
  <el-dialog :visible.sync="visible" fullscreen custom-class="preview">
    <div class="title" slot="title">{{ title }}</div>
    <el-container>
      <!-- <el-header>
        <div>{{ title }}</div>
      </el-header> -->
      <el-container style="height: 880px">
        <el-aside width="200px" style="border: 1px solid #eee; overflow-x: hidden">
          <div class="pp" v-for="i in numPages" :key="i" @click="onPageSelect(i)">
            <pdf :src="src" :page="i" style="margin: 10px"></pdf>
            <div style="text-align: center; margin-bottom: 30px">{{ i }}</div>
          </div>
        </el-aside>
        <el-main>
          <div class="page" v-for="i in numPages" :key="i" :id="`page${i}`">
            <pdf :src="src" :page="i" @num-pages="pageCount = $event" @page-loaded="currentPage = $event" @progress="loadedRatio = $event" @loaded="loadPdfHandler" class="pdf"></pdf>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-dialog>
</template>

<script>
import pdf from "vue-pdf";
import { DialogMixin } from "@/libs/mixin";
export default {
  mixins: [DialogMixin],
  components: {
    pdf,
  },
  props: {
    title: String,
    url: String,
  },
  errorCaptured() {
    return false;
  },
  data() {
    return {
      src: pdf.createLoadingTask(this.url),
      numPages: undefined,
      loadedRatio: 0,
      currentPage: 1,
      pageCount: 0,
    };
  },
  methods: {
    loadPdfHandler() {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    onPageSelect(pageNo) {
      //index与循环的index对应可自由设置动态获取
      const page = document.querySelector("#page" + pageNo);
      page.scrollIntoView({ behavior: "instant", block: "start", inline: "start" });
    },
  },
  mounted() {
    this.src.promise.then((pdf) => {
      this.numPages = pdf.numPages;
    });
  },
};
</script>

<style lang="stylus" >
.preview
  background-color: rgb(247, 249, 252);

  .el-dialog__header
    background-color: #fff;

  .el-dialog__body
    padding: 0;

.pp
  cursor: pointer;

  span
    border: 1px solid #eef;
    border-radius: 3px;

.pdf
  margin: 0 auto;
  overflow-x: hidden;
  padding: 10px 100px;
  width: 50%;
</style>