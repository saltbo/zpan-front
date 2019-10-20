<template>
	<div>
		<el-dialog title="上传队列" :visible.sync="visible">
			<el-upload class="upload-demo" action="" :http-request="handleUpload" :limit="20" :on-exceed="handleExceed" drag
				multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script>
import utils from '@/libs/utils.js'
import mixinDialog from '@/libs/mixin-dialog.js'
export default {
	name: 'Uploader',
	mixins: [mixinDialog],
	props: {
		destDir: String,
	},
	data() {
		return {
			fileList: [],
		}
	},
	methods: {
		handleExceed(files, fileList) {
			this.$message.warning(`每次最多允许 20 个文件同时上传，请分批操作！`);
		},
		handleUpload(fileObj) {
			fileObj.filename = fileObj.file.name;
			utils.uploadURL(fileObj, this.destDir).then(ret => {
				utils.upload(fileObj, ret.url, ret.headers).then(this.finish)
			})
		},
	},
}

</script>

<style scoped>
</style>