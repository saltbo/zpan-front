<template>
	<el-container>
		<el-aside width="200px" style="height: 100%; background-color: #f7f7f7;">
			<el-menu :default-active="active" background-color="#f7f7f7" router>
				<el-menu-item index="/disk">
					<i class="el-icon-document"></i>
					<span slot="title">全部文件</span>
				</el-menu-item>
				<el-menu-item index="/disk?type=doc">
					<i class="el-icon-xx"></i>
					<span slot="title">文档</span>
				</el-menu-item>
				<el-menu-item index="/disk?type=image">
					<i class="el-icon-xx"></i>
					<span slot="title">图片</span>
				</el-menu-item>
				<el-menu-item index="/disk?type=audio">
					<i class="el-icon-xx"></i>
					<span slot="title">音频</span>
				</el-menu-item>
				<el-menu-item index="/disk?type=video">
					<i class="el-icon-xx"></i>
					<span slot="title">视频</span>
				</el-menu-item>
				<el-menu-item index="/share">
					<i class="el-icon-share"></i>
					<span slot="title">我的分享</span>
				</el-menu-item>
				<el-menu-item index="/picture">
					<i class="el-icon-picture-outline"></i>
					<span slot="title">我的图床</span>
				</el-menu-item>
				<!-- <el-menu-item index="/recyclebin">
					<i class="el-icon-delete"></i>
					<span slot="title">回收站</span>
				</el-menu-item> -->
			</el-menu>
			<el-row class="storage">
				<el-col :span="7" style="font-size: 40px;">
					<i class="el-icon-coin"></i>
				</el-col>
				<el-col :span="17">
					<p>存储空间</p>
					<el-progress :percentage="storage.percentage"></el-progress>
					<p style="color: rgba(0, 0, 0, 0.54); font-size: 0.75rem;">已使用{{storage.used}}，共{{storage.max}}</p>
				</el-col>
			</el-row>
		</el-aside>

		<el-container ref="main">
			<el-main>
				<router-view></router-view>
			</el-main>
			<el-footer>
				<span class="brand">
					Powered by <a target="_blank" href="https://github.com/saltbo/zpan">ZPan</a>
				</span>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script>
import { store } from '@/store'
export default {
	name: 'app',
	components: {
	},
	data() {
		return {
			active: 'disk',
			storage: {},
			clientHeight: 1000,
		}
	},
	watch: {
		'$route': 'onRouteChange',
		'clientHeight': 'onClientHeightChange'
	},
	methods: {
		onRouteChange(newVal, oldVal) {
			this.active = newVal.fullPath;
			this.storage = store.storage;

		},
		onClientHeightChange(clientHeight) { //动态修改样式
			this.$refs.main.$el.style.height = this.clientHeight - 60 + 'px';
		},
	},
	mounted() {
		// 获取浏览器可视区域高度
		this.clientHeight = `${document.documentElement.clientHeight}`
		window.onresize = function temp() {
			this.clientHeight = `${document.documentElement.clientHeight}`;
		};

		this.active = this.$route.fullPath;
		setTimeout(() => {
			this.storage = store.storage;
		}, 100)
	},
}
</script>

<style scoped>
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
