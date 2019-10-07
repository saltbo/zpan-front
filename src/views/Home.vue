<style scoped>
.menu {
	margin-bottom: 20px;
}
.matter-icon {
	font-size: 35px;
}
.matter-title {
	display: inline;
	margin-left: 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	top: -8px;
	position: relative;
}

.el-table__row .operation {
	/* position: relative;
	top: 8px; */
}
.el-table__row .operation {
	display: none;
}
.el-table__row:hover .operation {
	display: block;
}
.operation .el-link {
	font-size: 20px !important;
	margin: 0 2px;
}
</style>

<template>
	<div>
		<el-row class="menu">
			<el-button type="primary" size="medium" icon="el-icon-upload" @click="()=>{this.uploadShow=true}">上传</el-button>
			<el-button size="medium" icon="el-icon-folder-add" @click="createFolder">新建</el-button>
			<el-button-group v-show="selectedItems.length>0" style="margin-left: 10px;">
				<el-button type="primary" icon="el-icon-download" size="medium" plain>下载</el-button>
				<el-button type="primary" icon="el-icon-share" size="medium" @click="share" plain>分享</el-button>
				<el-button type="primary" icon="el-icon-delete" size="medium" plain>删除</el-button>
				<el-button type="primary" size="medium" plain>移动到</el-button>
			</el-button-group>
		</el-row>
		<el-row class="bread">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/home' }">全部文件</el-breadcrumb-item>
				<el-breadcrumb-item v-for="item in items" :key="item.dir" :index="item.dir" :to="{ path: `/home?path=${item.dir}` }">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb>
		</el-row>

		<!-- table -->
		<el-table :data="tableData" @selection-change="onSelectChange" tooltip-effect="dark" style="width: 100%">
			<!-- <el-table-column type="selection" width="30">
			</el-table-column> -->
			<el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip sortable>
				<template slot-scope="scope">
					<i v-if="scope.row.dir" class="matter-icon el-icon-folder" style="color: #ffc402;"></i>
					<i v-else class="matter-icon el-icon-document"></i>
					<el-link :underline="false" class="matter-title" href="Javascript: void(0);">
						<span @click="objectOp(scope.row)">{{ scope.row.name }}</span>
					</el-link>
				</template>
			</el-table-column>
			<el-table-column width="150">
				<template slot-scope="scope">
					<div style="float: right;vertical-align: super;" class="operation">
						<el-link type="primary" :underline="false"><i class="el-icon-download el-icon--right" @click="download(scope.row)"></i></el-link>
						<el-link type="primary" :underline="false"><i class="el-icon-share el-icon--right" @click="share(scope.row)"></i></el-link>
						<el-link type="primary" :underline="false"><i class="el-icon-delete el-icon--right" @click="remove(scope.row)"></i></el-link>
						<!-- <el-link type="primary" :underline="false"><i class="el-icon-more el-icon--right"></i></el-link> -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="size" label="大小" width="180">
				<template slot-scope="scope">
					<div v-if="scope.row.size == '0 Bytes'">-</div>
					<dir v-else>{{ scope.row.size }}</dir>
				</template>
			</el-table-column>
			<el-table-column prop="updated" label="修改日期" width="180">
				<template slot-scope="scope">{{ scope.row.updated | moment}}</template>
			</el-table-column>
		</el-table>

		<!-- dialog -->
		<el-dialog title="上传队列" :visible.sync="uploadShow">
			<el-upload class="upload-demo" action="" :http-request="upload" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-dialog>

		<!-- photoView -->
		<PhotoPreview ref="photoView"></PhotoPreview>
	</div>
</template>

<script>
// @ is an alias to /src
import PhotoPreview from '@/components/PhotoPreview.vue'
export default {
	name: 'home',
	components: {
		PhotoPreview
	},
	data() {
		return {
			uploadShow: false,
			currentDir: '',
			currentType: '',
			items: [],
			fileList: [],
			tableData: [],
			selectedItems: [],
		}
	},
	watch: {
		'$route': 'onRouteChange',
	},
	methods: {
		loadCurrentDir() {
			this.items = [];
			if (!this.currentDir) {
				return;
			}

			let parentDir = '';
			let items = this.currentDir.split('/');
			console.log(items)
			items.forEach(item => {
				if (item == '') return;

				this.items.push({ name: item, dir: parentDir + item + '/' })
				parentDir = `${item}/`
			});
		},
		onRouteChange(newVal, oldVal) {
			this.currentDir = ''
			this.currentType = ''
			if (newVal.query.path) {
				this.currentDir = newVal.query.path;
			}

			if (newVal.query.type) {
				this.currentType = newVal.query.type;
			}

			this.loadCurrentDir();
			this.listRefresh();
		},
		formatBytes(bytes, decimals) {
			if (bytes == 0) return '0 Bytes';
			var k = 1000,
				dm = decimals + 1 || 3,
				sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		},
		listRefresh() {
			this.$axios.get('/api/files', { params: { path: this.currentDir, type: this.currentType } }).then(ret => {
				this.tableData = ret.data.list.map(item => { item.size = this.formatBytes(item.size, 1); return item });
			})
		},
		isOfficeFile(type) {
			let officeTypes = [
				'application/msword',
				'application/vnd.ms-excel',
				'application/vnd.ms-powerpoint',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			];
			return officeTypes.includes(type)
		},
		objectOp(obj) {
			if (obj.dir) {
				// open a folder
				this.$router.replace(`/home?path=${obj.path}`)
				return
			}

			// preview image file
			if (obj.type.startsWith('image')) {
				this.objectURL(obj).then((item) => {
					this.$refs.photoView.open(item.url);
				})
			}

			// preview office file
			if (this.isOfficeFile(obj.type)) {
				this.objectURL(obj).then(item => {
					window.open('http://view.officeapps.live.com/op/view.aspx?src=' + item.url)
				})
			}
		},
		objectURL(obj) {
			return new Promise((resolve, reject) => {
				let params = { object: obj.parent + obj.name, type: obj.type, parent: obj.parent };
				this.$axios.get('/api/urls/download', { params: params }).then(ret => {
					console.log(ret.data.data.url)
					resolve(ret.data.data)
				}).catch(reject)
			})
		},
		download(obj) {
			this.objectURL(obj).then((item) => {
				var a = document.createElement('a');
				a.href = item.url;
				a.download = item.name;
				a.click();
			})
		},
		share(obj) { },
		remove(obj) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', `删除${obj.name}`, {
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
		upload(fileObj) {
			let file = fileObj.file
			let type = 'application/octet-stream';
			if (file.type) type = file.type;
			this.$axios.get('/api/urls/upload', { params: { object: this.currentDir + file.name, type: type, size: file.size, parent: this.currentDir } }).then(ret => {
				let data = ret.data.data;
				let options = { headers: { 'content-type': type, 'content-disposition': `attachment;filename="${encodeURIComponent(file.name)}"`, 'x-oss-callback': data.callback } };
				options.onUploadProgress = function (event) {
					file.percent = event.loaded / event.total * 100;
					fileObj.onProgress(file);
				}
				console.log(data.url, file, options)
				this.$axios.put(data.url, file, options).then(ret => {
					fileObj.onSuccess();
					this.listRefresh();
				})
			})
		},
		onSelectChange(val) {
			this.selectedItems = val;
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePreview(file) {
			console.log(file);
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${file.name}？`);
		}
	},
	mounted() {
		if (this.$route.query.path) {
			this.currentDir = this.$route.query.path;
		}
		if (this.$route.query.type) {
			this.currentType = this.$route.query.type;
		}

		this.loadCurrentDir()
		this.listRefresh();
	},
}
</script>
