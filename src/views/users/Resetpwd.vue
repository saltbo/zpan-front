<template>
	<div class="guest">
		<el-row style="height: 150px;"></el-row>
		<div style="width: 400px; margin: 0 auto;">
			<el-card class="box-card" style="padding: 10px 20px;">
				<div slot="header">
					<i class="icon el-icon-key"></i>
					<p class="title">找回密码</p>
				</div>

				<el-form :model="formItem" :rules="rules" ref="formItem">
					<el-form-item prop="email">
						<el-input v-model="formItem.email" placeholder="电子邮箱" readonly></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" v-model="formItem.password" placeholder="密码"></el-input>
					</el-form-item>
					<el-form-item prop="password2">
						<el-input type="password" v-model="formItem.password2" placeholder="密码确认"></el-input>
					</el-form-item>
					<el-form-item>
						<el-row>
							<el-button type="primary" @click="reset('formItem')" style="width: 100%;">重置密码</el-button>
						</el-row>
						<el-row>
							<el-link type="primary" :underline="false" @click="$router.push({name: 'signin'})">返回登录</el-link>
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
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.formItem.password2 !== '') {
					this.$refs.formItem.validateField('password2');
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.formItem.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};

		return {
			rules: {
				password: [
					{ validator: validatePass, trigger: 'blur', required: true }
				],
				password2: [
					{ validator: validatePass2, trigger: 'blur', required: true }
				],
			},
			formItem: {}
		}
	},
	methods: {
		reset(name) {
			this.$refs[name].validate((valid) => {
				if (!valid) {
					return
				}

				this.$axios.patch('/api/user/password', this.formItem).then(ret => {
					this.$message({
						type: 'success',
						message: '密码重置成功!'
					});
					this.$router.push({ name: 'signin' })
				})
			});
		},
	},
	mounted() {
		this.formItem = this.$route.query
	},
}
</script>
