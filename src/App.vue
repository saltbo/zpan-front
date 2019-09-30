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
						<el-dropdown trigger="click">
							<el-avatar :size="30" :src="profile.avatar" style="vertical-align: middle;"></el-avatar>
							<el-dropdown-menu slot="dropdown">
								<el-row style="padding: 10px; width: 230px;">
									<el-col :span="8">
										<el-avatar :size="50" :src="profile.avatar"></el-avatar>
									</el-col>
									<el-col :span="16">
										<p>{{ profile.nickname}}</p>
										<p>{{ profile.email}}</p>
										<el-tag>管理员</el-tag>
									</el-col>
								</el-row>
								<el-dropdown-item icon="el-icon-s-home" divided>个人主页</el-dropdown-item>
								<el-dropdown-item icon="el-icon-switch-button">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-row>

			</el-header>
			<el-container>
				<el-aside width="200px" style="height: 100%; background-color: #f7f7f7;">
					<el-menu default-active="home" background-color="#f7f7f7" router>
						<el-menu-item index="home">
							<i class="el-icon-document"></i>
							<span slot="title">全部文件</span>
						</el-menu-item>
						<el-menu-item index="home?type=doc">
							<i class="el-icon-xx"></i>
							<span slot="title">文档</span>
						</el-menu-item>
						<el-menu-item index="home?type=image">
							<i class="el-icon-xx"></i>
							<span slot="title">图片</span>
						</el-menu-item>
						<el-menu-item index="home?type=audio">
							<i class="el-icon-xx"></i>
							<span slot="title">音频</span>
						</el-menu-item>
						<el-menu-item index="home?type=video">
							<i class="el-icon-xx"></i>
							<span slot="title">视频</span>
						</el-menu-item>
						<el-menu-item index="share">
							<i class="el-icon-share"></i>
							<span slot="title">我的分享</span>
						</el-menu-item>
						<el-menu-item index="recyclebin">
							<i class="el-icon-delete-solid"></i>
							<span slot="title">回收站</span>
						</el-menu-item>
					</el-menu>
					<el-row class="storage">
						<el-col :span="7" style="font-size: 40px;">
							<i class="el-icon-coin"></i>
						</el-col>
						<el-col :span="17">
							<p>存储空间</p>
							<el-progress :percentage="10"></el-progress>
							<p style="color: rgba(0, 0, 0, 0.54); font-size: 0.75rem;">已使用3.22MB，共1GB</p>
						</el-col>
					</el-row>
				</el-aside>

				<el-container>
					<el-main>
						<router-view></router-view>
					</el-main>
					<el-footer>
						<span class="brand">
							Powered by <a target="_blank" href="https://github.com/eyebluecn/tank">ZPan</a>
						</span>
					</el-footer>
				</el-container>
			</el-container>

		</el-container>
	</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
	name: 'app',
	components: {
		HelloWorld
	},
	data() {
		return {
			searchKw: '',
			profile: {
				nickname: 'Admin',
				email: 'admin@zzpan.cn',
				avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
			}
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
		menuSelect(index, indexPath) {
			console.log(index, indexPath)
		}
	},
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
.search input {
	/* background-color: rgba(255, 255, 255, 0.15);
	caret-color: #fff;
	border: none; */
}
.search i {
	/* color: #fff; */
}
.el-main {
	padding: 10px !important;
}
.el-footer {
	height: 30px !important;
	text-align: center;
}

.el-aside .el-menu {
	border-right: solid 1px #fff;
	font-weight: 500;
}

.el-aside .el-menu-item {
	padding-left: 30px !important;
}

.el-aside .el-menu-item:focus,
.el-aside .el-menu-item:hover {
	outline: 0;
	background-color: #eaeaea !important;
}
.el-aside .storage {
	border-top: 1px solid #c9c9c9;
	width: 200px;
	padding: 20px 10px;
	position: absolute;
	bottom: 0;
}
</style>
