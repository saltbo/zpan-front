<template>
	<div class="guest">
		<el-row style="height: 150px;"></el-row>
		<div style="width: 400px; margin: 0 auto;">
			<el-card class="box-card" style="padding: 10px 20px;">
				<div slot="header">
					<i class="icon el-icon-lock"></i>
					<p class="title">登录Z盘</p>
				</div>

				<el-form :model="formItem" :rules="rules" ref="formItem">
					<el-form-item prop="email">
						<el-input v-model="formItem.email" placeholder="电子邮箱"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input v-model="formItem.password" type="password" placeholder="密码" @keyup.enter.native="signIn('formItem')"></el-input>
					</el-form-item>
					<el-form-item>
						<el-row>
							<el-button type="primary" @click="signIn('formItem')" style="width: 100%;">登录</el-button>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-link type="primary" :underline="false" @click="goto('reset')">忘记密码</el-link>
							</el-col>
							<el-col :span="12" style="text-align: right">
								<el-link type="primary" :underline="false" @click="goto('signup')">注册账号</el-link>
							</el-col>
						</el-row>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			rules: {
				email: [
					{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
					{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
				],
			},
			formItem: {},
		}
	},
	methods: {
		goto(name) {
			this.$router.push({ name: name })
		},
		signIn(name) {
			this.$refs[name].validate((valid) => {
				if (!valid) {
					return
				}

				this.$axios.post('/api/user/tokens', this.formItem).then(ret => {
					this.$message({
						type: 'success',
						message: '登录成功!'
					});
					this.$router.push({ name: 'home' })
				})
			});
		},
	},
	mounted() {
		this.formItem = this.$route.query
	},
}
</script>
