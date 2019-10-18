<style scoped>
.menu {
	margin-bottom: 20px;
}
</style>

<template>
	<div>
		<el-row class="menu">
			<el-button type="primary" size="medium" icon="el-icon-upload" @click="uploadShow=true">上传</el-button>
			<el-button type="primary" size="medium" icon="el-icon-folder-add" @click="createFolder" plain>新建</el-button>
			<el-button-group v-show="selectedItems.length>0" style="margin-left: 10px;">
				<el-button type="primary" icon="el-icon-download" size="medium" plain @click="downloadSelection">下载</el-button>
				<!-- <el-button type="primary" icon="el-icon-share" size="medium" @click="share" plain>分享</el-button> -->
				<el-button type="primary" icon="el-icon-delete" size="medium" plain @click="deleteSelection">删除</el-button>
				<!-- <el-button type="primary" size="medium" plain>移动到</el-button> -->
			</el-button-group>
		</el-row>

		<!-- main -->
		<FileTable v-model="tableData" :selection.sync="selectedItems" :loading="loading" :current="currentDir" :urlget="urlGet" @folder-open="openFolder" @on-share="share" @on-remove="remove" show-share show-remove></FileTable>

		<!-- dialog -->
		<el-dialog title="上传队列" :visible.sync="uploadShow">
			<el-upload class="upload-demo" action="" :http-request="handleUpload" :file-list="fileList" :limit="20" :on-exceed="handleExceed" drag multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
		</el-dialog>

		<!-- dialog -->
		<el-dialog title="分享链接" :width="shareForm.width" :visible.sync="shareShow">
			<el-form v-show="!shareForm.done">
				<el-form-item label="使用提取码保护链接" style="margin-left: 20px;">
					<el-switch v-model="shareForm.private"></el-switch>
				</el-form-item>
				<el-form-item label="有效期" style="margin-left: 20px;">
					<el-select v-model="shareForm.expire_sec">
						<el-option label="7天" :value="604800"></el-option>
						<el-option label="30天" :value="2592000"></el-option>
						<el-option label="一年" :value="31536000"></el-option>
					</el-select>
				</el-form-item>
			</el-form>

			<div v-show="shareForm.done" style="margin-left: 50px; line-height: 30px;">
				<p>链接地址：<a :href="shareForm.link" target="_blank">{{shareForm.link}} </a></p>
				<p v-if="shareForm.secret">提取码：{{shareForm.secret}} </p>
			</div>

			<span slot="footer" class="dialog-footer">
				<div v-if="!shareForm.done">
					<el-button @click="shareShow = false">取 消</el-button>
					<el-button type="primary" @click="shareBuild">确 定</el-button>
				</div>
				<div v-else>
					<el-button type="primary">点击复制链接</el-button>
					<el-button @click="shareShow = false">关 闭</el-button>
				</div>
			</span>
		</el-dialog>
	</div>
</template>

<script>
// @ is an alias to /src
import utils from '@/libs/utils.js'
import FileTable from '@/components/FileTable'
export default {
	name: 'home',
	components: {
		FileTable
	},
	data() {
		return {
			uploadShow: false,
			shareShow: false,
			currentDir: '',
			currentType: '',
			items: [],
			fileList: [],
			tableData: [],
			loading: false,
			selectedItems: [],
			shareForm: {
				mid: 0,
				private: false,
				done: false,
				width: '30%',
			},
		}
	},
	watch: {
		'$route': 'onRouteChange',
		uploadShow() {
			this.fileList = []
		},
	},
	methods: {
		onRouteChange(newVal, oldVal) {
			this.currentDir = ''
			this.currentType = ''
			if (newVal.query.path) {
				this.currentDir = newVal.query.path;
			}

			if (newVal.query.type) {
				this.currentType = newVal.query.type;
			}

			this.listRefresh();
		},
		onSelectionChange(selection) {
			this.selectedItems = selection;
		},
		listRefresh() {
			this.loading = true;
			let params = { dir: this.currentDir }
			if (this.currentType) {
				params.search = true;
				params.type = this.currentType;
			}

			utils.listObjects(params).then(objects => {
				this.tableData = objects
				this.loading = false;
			})
		},
		openFolder(fullPath) {
			this.$router.push({ query: { path: fullPath } })
		},
		urlGet(obj) {
			return new Promise((resolve, reject) => {
				utils.objectURL(obj).then(ret => {
					resolve(ret.url)
				}).catch(reject)
			})
		},
		download(obj) {
			utils.objectURL(obj).then((item) => {
				utils.download(obj.name, item.url)
			})
		},
		share(obj) {
			this.shareShow = true;
			this.shareForm = {
				done: false,
				width: '30%',
				mid: obj.id,
				private: false,
				expire_sec: 604800
			}
		},
		shareBuild(done) {
			this.$axios.post('/api/shares', this.shareForm).then(ret => {
				let host = window.location.host;
				let alias = ret.data.data.alias;

				this.shareForm.done = true;
				this.shareForm.width = '50%';
				this.shareForm.link = `http://${host}/s/${alias}`
				this.shareForm.secret = ret.data.data.secret;
			})
		},
		remove(obj) {
			if (obj.dir) {
				this.$message('暂不支持删除文件夹')
				return
			}

			this.$confirm('此操作将永久删除该文件, 是否继续?', `删除 ${obj.name}`, {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$axios.delete('/api/files/' + obj.id).then(ret => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.listRefresh();
				})
			})
		},
		createFolder() {
			this.$prompt('请输入文件夹名称', '新建文件夹', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(({ value }) => {
				let body = {
					path: this.currentDir + value + '/',
					parent: this.currentDir,
					type: '', size: 0,
				}
				this.$axios.post('/api/files/folders', body).then(ret => {
					this.$message({
						type: 'success',
						message: '创建成功!'
					});
					this.listRefresh();
				})
			})
		},
		handleExceed(files, fileList) {
			this.$message.warning(`每次最多允许 20 个文件同时上传，请分批操作！`);
		},
		handleUpload(fileObj) {
			fileObj.filename = fileObj.file.name;
			utils.upload(fileObj, this.currentDir).then(ret => {
				this.listRefresh();
			})
		},
		downloadSelection() {

		},
		deleteSelection() {
			this.$confirm('此操作将永久删除所选文件, 是否继续?', `批量删除`, {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				const loading = this.$loading({
					lock: true,
					text: 'Deleting',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});

				Promise.all(this.selectedItems.map(obj => {
					return this.$axios.delete('/api/files/' + obj.id)
				})).then(ret => {
					this.listRefresh();
					loading.close();
					this.$message({
						type: 'success',
						message: '所选文件全部删除成功!'
					});
				}).catch(err => {
					loading.close();
					console.log(err);
				});
			})
		},
	},
	mounted() {
		if (this.$route.query.path) {
			this.currentDir = this.$route.query.path;
		}
		if (this.$route.query.type) {
			this.currentType = this.$route.query.type;
		}

		this.listRefresh();
	},
}
</script>
