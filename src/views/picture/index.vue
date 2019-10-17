<template>
	<div>
		<el-upload action="" list-type="picture-card" :http-request="handleUpload" :accept="acceptImgs" :file-list="fileList" :on-preview="showPicPreview" :before-remove="handleRemove">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog :visible.sync="dialog.show" :title="dialog.title" center>
			<img width="100%" :src="dialog.imgUrl" alt="">

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="copy-link" :data-clipboard-text="dialog.imgUrl" @click="dialog.show = false">复制外链</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import utils from '@/libs/utils.js'
export default {
	data() {
		return {
			picDir: '__pics/',
			picHost: '',
			acceptImgs: 'image/jpeg,image/png,image/gif',
			fileList: [],
			dialog: {
				show: false,
				title: '',
				imgUrl: '',
			}
		}
	},
	methods: {
		findPicHost() {
			let host = 'https://saltbo-zpan-test.oss-cn-zhangjiakou.aliyuncs.com'

			const uid = localStorage.getItem('uid');
			this.picHost = `${host}/${uid}/`
		},
		listRefresh() {
			// this.loading = true;
			utils.listObjects({ dir: this.picDir }).then(objects => {
				this.fileList = objects.map(obj => { return { id: obj.id, name: obj.name, url: this.picHost + obj.path } })
				this.loading = false;
			})
		},
		handleUpload(fileObj) {
			utils.upload(fileObj, this.picDir).then(ret => {
				let file = { name: fileObj.file.name, url: `${this.picHost}${this.picDir}${fileObj.file.name}` }
				this.showPicPreview(file);
			})
		},
		handleRemove(file, fileList) {
			return this.$confirm('此操作将永久删除该文件, 是否继续?', `删除${file.name}`, {
				type: 'warning',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$axios.delete('/api/files/' + file.id).then(ret => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				})
			})
		},
		showPicPreview(file) {
			this.dialog = {
				show: true,
				title: file.name,
				imgUrl: file.url,
			};
		}
	},
	mounted() {
		this.findPicHost();
		this.listRefresh();

		// setup clipboard
		this.$clipboard.on("success", (e) => {
			this.$message.success('复制成功');
			e.clearSelection();
		});
		this.$clipboard.on("error", (e) => {
			this.$message.error('复制失败');
		});
	},
	beforeDestroy() {
		this.$clipboard.destroy();
	},
}
</script>

<style scoped>
</style>