<template>
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>欢迎</span>
        </div>
        <div>
          <el-row :gutter="12">
            <el-col :span="3">
              <el-card shadow="always">
                <el-link type="primary" icon="el-icon-document" href="https://zpan.space" target="_blank">文档</el-link>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card shadow="always">
                <el-link type="primary" icon="el-icon-files" href="https://github.com/saltbo/zpan" target="_blank">源码</el-link>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card shadow="always">
                <el-link type="primary" icon="el-icon-s-comment" href="https://github.com/saltbo/zpan/issues" target="_blank">社区</el-link>
              </el-card>
            </el-col>
            <el-col :span="3">
              <el-card shadow="always">
                <el-link type="primary" icon="el-icon-coffee-cup" href="https://github.com/sponsors/saltbo" target="_blank">捐赠</el-link>
              </el-card>
            </el-col>
          </el-row>
          <p style="margin-top: 20px; font-size: 14px; font-weight: bold; font-style: italic">Tips: 管理后台还在逐步迭代中，欢迎到社区提问交流~</p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>产品动态</span>
        </div>

        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      activities: [
        {
          content: "v1.4.1版本发布",
          timestamp: "2020-10-17",
        },
        {
          content: "v1.4.0版本发布",
          timestamp: "2020-10-13",
        },
        {
          content: "v1.3.0版本发布",
          timestamp: "2020-09-20",
        },
        {
          content: "v1.2.0版本发布，进行了大规模重构",
          timestamp: "2020-09-06",
        },
        {
          content: "v1.1.0版本发布",
          timestamp: "2019-10-24",
        },
        {
          content: "v1.0.0版本发布，第一个可用版本",
          timestamp: "2019-10-12",
        },
        {
          content: "项目创立，完成基础功能",
          timestamp: "2019-09-28",
        },
      ],
    };
  },
};
</script>

<style>
</style>