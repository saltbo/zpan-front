<template>
	<div>
		<el-row class="bread">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item v-for="item in pathItems" :key="item.dir" :index="item.dir" :to="{ query: {path: item.dir} }">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb>
		</el-row>

		<!-- table -->
		<el-table :data="value" v-loading="loading" tooltip-effect="dark" style="width: 100%">
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
					<div style="float: right; vertical-align: super;" class="operation">
						<el-link v-show="showDown && !scope.row.dir" type="primary" :underline="false"><i class="el-icon-download el-icon--right" @click="onDownload(scope.row)"></i></el-link>
						<el-link v-show="showShare" type="primary" :underline="false"><i class="el-icon-share el-icon--right" @click="onShare(scope.row)"></i></el-link>
						<el-link v-show="showRemove" type="primary" :underline="false"><i class="el-icon-delete el-icon--right" @click="onRemove(scope.row)"></i></el-link>
						<!-- <el-link type="primary" :underline="false"><i class="el-icon-more el-icon--right"></i></el-link> -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="size" label="大小" width="180">
				<template slot-scope="scope">
					<div v-if="scope.row.dir">-</div>
					<dir v-else>{{ scope.row.size }}</dir>
				</template>
			</el-table-column>
			<el-table-column prop="updated" label="修改日期" width="180">
				<template slot-scope="scope">{{ scope.row.updated | moment}}</template>
			</el-table-column>
		</el-table>

		<!-- photoView -->
		<PhotoPreview ref="photoView"></PhotoPreview>
	</div>
</template>

<script>
import PhotoPreview from './PhotoPreview.vue'
export default {
	name: 'FileTable',
	props: {
		value: Array,
		loading: Boolean,
		current: String,
		urlget: Function,
		showDown: {
			type: Boolean,
			default: true,
		},
		showShare: {
			type: Boolean,
			default: false,
		},
		showRemove: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		PhotoPreview
	},
	data() {
		return {
			root: '',
			pathItems: []
		}
	},
	watch: {
		current(newValue, oldValue) {
			this.loadPathItems();
		}
	},
	methods: {
		loadPathItems() {
			this.pathItems = [{ name: '全部文件', dir: '' }];
			if (this.current == "") {
				return;
			}

			let parentDir = '';
			let pathItems = this.current.split('/');
			pathItems.forEach(item => {
				if (item == '') return;

				this.pathItems.push({ name: item, dir: parentDir + item + '/' })
				parentDir = `${item}/`
			});
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
				this.$emit("folder-open", obj.path)
				return
			}

			// preview image file
			if (obj.type.startsWith('image')) {
				this.urlget(obj).then(url => {
					this.$refs.photoView.open(url);
				})
			}

			// preview office file
			if (this.isOfficeFile(obj.type)) {
				this.urlget(obj).then(url => {
					window.open('http://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url))
				})
			}
		},
		onDownload(obj) {
			this.urlget(obj).then(url => {
				this.openDownload(obj.name, url)
			})
		},
		onShare(obj) {
			this.$emit("on-share", obj)
		},
		onRemove(obj) {
			this.$emit("on-remove", obj)
		},
		openDownload(name, url) {
			var a = document.createElement('a');
			a.href = url;
			a.download = name;
			a.click();
		},
	},
	mounted() {
		this.loadPathItems();
	},
}
</script>

<style scoped>
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