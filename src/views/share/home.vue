<template>
	<div style="margin: 20px 50px;">
		<!-- for file -->
		<div v-show="file.dirtype==0" style="width: 800px; margin: 0 auto">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>{{file.name}}</span>
				</div>
				<div class="text item">
					<a :href="fileURL">您的文件已经开始下载，如果没有开始请单击此处重试</a>
				</div>
			</el-card>
		</div>

		<!-- for private file -->
		<el-card v-show="private" class="box-card" style="width: 500px; margin: 100px auto;">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="提取码">
					<el-input v-model="drawcode" placeholder="请输入提取码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="draw">提取文件</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- for folder -->
		<el-card v-show="file.dirtype" class="box-card">
			<div slot="header" class="clearfix">
				<span>{{file.name}}</span>
				<p>{{file.created | moment}}</p>
			</div>

			<div>
				<FileTable v-model="tableData" :current="currentDir" @folder-open="openFolder" :urlget="urlGet"></FileTable>
			</div>
		</el-card>
	</div>
</template>

<script>
import utils from '@/libs/utils.js'
import FileTable from '@/components/FileTable'
export default {
	components: {
		FileTable,
	},
	data() {
		return {
			file: {},
			fileURL: '',
			rootDir: '',
			currentDir: '',
			tableData: [],
			private: false,
			drawcode: ''
		}
	},
	watch: {
		'$route': 'onRouteChange',
	},
	methods: {
		onRouteChange(newVal, oldVal) {
			this.currentDir = '';
			if (newVal.query.path) {
				this.currentDir = newVal.query.path;
			}

			this.listRefresh();
		},
		openFolder(fullPath) {
			this.currentDir = fullPath.replace(this.rootDir, '') // 隐藏根路径
			this.$router.push({ query: { path: this.currentDir } })
		},
		urlGet(obj) {
			return new Promise((resolve, reject) => {
				utils.downloadURL(obj.id).then(ret => {
					resolve(ret.url)
				}).catch(reject)
			})
		},
		draw() {
			console.log();
			let alias = this.$route.params.alias
			let path = this.$route.query.path ? this.$route.query.path : ""
			this.$axios.get(`/api/shares/${alias}`, { params: { secret: this.drawcode } }).then(ret => {
				this.file = ret.data.data;
				this.private = false;
				if (!this.file.name) {
					this.private = true
					return;
				}

				if (this.file.dirtype) {
					this.rootDir = `${this.file.parent}${this.file.name}/` // 以分享的文件夹为根路径
					this.currentDir = path //以query中的path作为当前路径
					this.listRefresh()
					return;
				}

				// auto download
				utils.downloadURL(this.file.id).then(ret => {
					utils.download(this.file.name, ret.url)
					this.fileURL = ret.url;
				})
			})
		},
		listRefresh() {
			utils.listObjects({ dir: this.rootDir + this.currentDir }).then(objects => {
				this.tableData = objects
			})
		},
	},
	mounted() {
		this.draw()
	},
}
</script>

<style scoped>
</style>