<template>
	<div>
		<el-dialog title="移动到" width="30%" :visible.sync="visible">
			<el-tree :data="data" :props="props" node-key="id" :default-expanded-keys="[0]" :load="loadNode"
				:highlight-current="true" @current-change="onCurrentChange" lazy>
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>
						<i class="el-icon-folder"></i> {{ node.label }}
					</span>
				</span>
			</el-tree>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submit">确定</el-button>
				<el-button @click="visible = false">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import utils from '@/libs/utils.js'
import mixinDialog from '@/libs/mixin-dialog.js'
export default {
	mixins: [mixinDialog],
	data() {
		return {
			data: [

			],
			props: {
				label: 'name',
				children: 'zones',
				isLeaf: 'leaf'
			},
			srcId: 0,
			current: {}
		}
	},
	methods: {
		open(obj) {
			this.srcId = obj.id

			this.visible = true
		},
		onCurrentChange(item, node) {
			console.log(item)
			this.current = item;
		},
		loadNode(node, resolve) {
			console.log(node)
			if (node.level === 0) {
				return resolve([{ id: 0, name: '全部文件', object: '' }]);
			}

			utils.listObjects({ dir: node.data.object }).then(objects => {
				setTimeout(() => {
					return resolve(objects.filter(obj => { return obj.dir }));
				}, 100);
			})
		},
		submit() {
			let body = { id: this.srcId, action: 2, dest: this.current.object };
			this.$axios.post('/api/files/operation', body).then(ret => {
				this.$message({
					type: 'success',
					message: '文件移动成功!'
				});
				this.finish();
				this.close();
			})
		}
	},
}
</script>

<style scoped>
.custom-tree-node {
	font-size: 22px;
	line-height: 25px;
}
.el-icon-folder {
	color: #ffc402;
}
</style>
 No newline at end of file
