<template>
  <section>
    <Topbar />
    <div class="installer">
      <el-card style="padding: 40px" shadow="never">
        <el-steps class="step" :active="step" finish-status="success">
          <el-step title="配置数据库"></el-step>
          <el-step title="配置管理员账号"></el-step>
          <el-step title="安装完成"></el-step>
        </el-steps>

        <!-- step-1 -->
        <el-form v-show="stepShown(0)" :model="form.database" label-width="100px" class="form">
          <el-form-item label="数据库类型" prop="driver">
            <el-radio-group v-model="form.database.driver">
              <el-radio label="sqlite3"></el-radio>
              <el-radio label="mysql"></el-radio>
              <el-radio label="postgres"></el-radio>
              <el-radio label="mssql"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="DSN" prop="dsn">
            <el-input v-model="form.database.dsn"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="step++" type="primary">下一步</el-button>
          </el-form-item>
        </el-form>

        <!-- step-2 -->
        <el-form v-show="stepShown(1)" :model="form.administrator" ref="ruleForm" label-width="100px" class="form">
          <el-form-item label="管理员账号" prop="email">
            <el-input v-model="form.administrator.email"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" prop="password">
            <el-input type="password" v-model="form.administrator.password"></el-input>
          </el-form-item>
          <el-form-item label="密码确认" prop="passwordr">
            <el-input type="password" v-model="form.administrator.passwordr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="step--">上一步</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">开始安装</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </section>
</template>

<script>
import Topbar from "@/components/Topbar";
export default {
  components: {
    Topbar,
  },
  data() {
    return {
      step: 0,
      dsns: {
        sqlite3: "zpan.db",
        mysql: "user:pass@tcp(127.0.0.1:3306)/zpan?charset=utf8mb4&parseTime=True&loc=Local",
        postgres: "host=localhost user=admin password=admin dbname=zpan port=9920 sslmode=disable TimeZone=Asia/Shanghai",
        mssql: "sqlserver://zpan:LoremIpsum86@localhost:9930?database=zpan",
      },
      form: {
        database: {
          driver: "sqlite3",
          dsn: "zpan.db",
        },
        administrator: {
          email: "admin@zpan.space",
        },
      },
      rules: {
        // name: [
        //   { required: true, message: "请输入活动名称", trigger: "blur" },
        //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // region: [{ required: true, message: "请选择活动区域", trigger: "change" }],
        // date1: [{ type: "date", required: true, message: "请选择日期", trigger: "change" }],
        // date2: [{ type: "date", required: true, message: "请选择时间", trigger: "change" }],
        // type: [{ type: "array", required: true, message: "请至少选择一个活动性质", trigger: "change" }],
        // resource: [{ required: true, message: "请选择活动资源", trigger: "change" }],
        // desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  watch: {
    "form.database.driver"(nl, ol) {
      this.form.database.dsn = this.dsns[nl];
    },
  },
  computed: {},
  methods: {
    stepShown(step) {
      return this.step == step;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log("error submit!!");
          return;
        }

        console.log(this.form);
        this.$zpan.System.installDatabase(this.form.database).then((ret) => {
          setTimeout(() => {
            this.$zpan.System.createAdministrator(this.form.administrator).then(() => {
              this.$router.push({ name: "signin" });
            });
          }, 1000);
        });
      });
    },
  },
};
</script>

<style>
.installer {
  width: 900px;
  margin: 50px auto;
}

.step {
  margin-bottom: 80px;
}

.form {
  width: 600px;
  margin: 0 auto;
}
</style>