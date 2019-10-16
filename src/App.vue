<template>
	<div id="app">
		<el-container style="height: 100%;">
			<el-header>
				<el-row>
					<el-col :span="12">
						<div class="logo">
							<span>ZPan</span>
						</div>
						<el-autocomplete class="search" size="medium" prefix-icon="el-icon-search" placeholder="搜索..." v-model="searchKw" :trigger-on-focus="false" :fetch-suggestions="suggestions" @select="search"></el-autocomplete>
					</el-col>
					<el-col :span="12" style="text-align: right;">
						<el-dropdown v-show="logined" trigger="click" @command="onDropdown">
							<el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle;"></el-avatar>
							<el-dropdown-menu slot="dropdown">
								<el-row style="padding: 20px; width: 280px;">
									<el-col :span="11">
										<el-avatar :size="90" :src="profile.avatar"></el-avatar>
									</el-col>
									<el-col :span="13">
										<p>{{ profile.nickname}}</p>
										<p style="color: rgba(0, 0, 0, 0.54); margin: 5px 0">{{ profile.email}}</p>
										<el-tag>管理员</el-tag>
									</el-col>
								</el-row>
								<el-dropdown-item icon="el-icon-s-home" command="profile" divided>个人主页</el-dropdown-item>
								<el-dropdown-item icon="el-icon-switch-button" command="signout">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-row>
			</el-header>
			<router-view></router-view>
		</el-container>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import { mutations } from '@/store'
export default {
	data() {
		return {
			searchKw: '',
			logined: true,
			defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', 
			profile: {

			},
		}
	},
	methods: {
		suggestions(kw, cb) {
			var results = [
				{ value: `在我的文件中搜索 ${kw}` },
				{ value: `在全站分享中搜索 ${kw}` }
			];
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		search() {

		},
		formatBytes(bytes, decimals) {
			if (bytes == 0) return '0 Bytes';
			var k = 1024,
				dm = decimals + 1 || 3,
				sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '' + sizes[i];
		},
		userInfo() {
			let uid = Cookies.get('uid')
			if (!uid) {
				this.logined = false
				return
			}

			this.$axios.get('/api/users/' + uid).then(ret => {
				this.profile = ret.data.data
				if (this.profile.avatar == '') {
					this.profile.avatar = this.defaultAvatar;
				}

				this.storage = {
					used: this.formatBytes(this.profile.storage_used, 0),
					max: this.formatBytes(this.profile.storage_max, 0),
					percentage: Math.round((this.profile.storage_used / this.profile.storage_max) * 100)
				}
				mutations.setStorage(this.storage);
			})
		},
		onDropdown(index) {
			switch (index) {
				case 'profile':
					break
				case 'signout':
					Cookies.remove('uid');
					Cookies.remove('intoken');
					window.location = '/'
					break
			}
		}
	},
	mounted() {
		this.userInfo();
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
html,
body {
	width: 100%;
	height: 100%;
}

#app {
	/* font-family: "Avenir", Helvetica, Arial, sans-serif; */
	font-family: '12px/1.5 "Microsoft YaHei", arial, SimSun, 宋体;';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	background-color: #fff;
	height: 100%;
}

.el-header {
	color: #fff;
	line-height: 60px;
	background-color: #3f51b5;
}
.el-header .logo {
	width: 150px;
	display: inline-block;
	font-size: 35px;
	padding: 0 15px;
	vertical-align: middle;
}
.el-header .search {
	width: 300px;
}

.guest .el-card__header {
	text-align: center;
	border-bottom: none !important;
}
.guest .el-card__header .title {
	font-size: 20px;
	margin-top: 10px;
}
.guest .el-card__header .icon {
	font-size: 30px;
	color: #f50057;
}
</style>