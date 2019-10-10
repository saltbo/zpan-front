<template>
	<div>
		<div v-show="file.dir==false" style="width: 800px; margin: 0 auto">
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>{{file.name}}</span>
				</div>
				<div class="text item">
					<a :href="fileURL">您的文件已经开始下载，如果没有开始请单击此处重试</a>
				</div>
			</el-card>
		</div>
		<el-card v-show="file.dir" class="box-card">
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
		}
	},
	watch: {
		'$route': 'onRouteChange',
	},
	methods: {
		onRouteChange(newVal, oldVal) {
			if (!newVal.query.path) {
				this.currentDir = '';
			}

			// if (newVal.query.type) {
			// 	this.file.type = newVal.query.type;
			// }

			this.listRefresh();
		},
		openFolder(fullPath) {
			this.currentDir = fullPath.replace(this.rootDir, '') // 隐藏根路径
			this.$router.push({ query: { path: this.currentDir } })
		},
		urlGet(obj) {
			return new Promise((resolve, reject) => {
				utils.objectURL(obj).then(ret => {
					resolve(ret.url)
				}).catch(reject)
			})
		},
		listRefresh() {
			utils.listObjects(this.rootDir + this.currentDir, this.file.type).then(objects => {
				this.tableData = objects
			})
		},
	},
	mounted() {
		let alias = this.$route.params.alias
		let path = this.$route.query.path
		this.$axios.get(`/api/shares/${alias}`).then(ret => {
			this.file = ret.data.data;
			if (this.file.dir) {
				this.rootDir = this.file.path // 以分享的文件夹为根路径
				this.currentDir = path //以query中的path作为当前路径
				this.listRefresh()
				return;
			}

			// auto download
			utils.download(this.file.name, this.fileURL)
			utils.objectURL(this.file).then(ret => {
				this.fileURL = ret.url;
			})
		})
	},
}
</script>

<style scoped>
</style>