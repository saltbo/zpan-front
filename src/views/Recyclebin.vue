<template>
	<div>
		<el-table :data="tData" style="width: 100%">
			<el-table-column label="文件名" prop="name">
			</el-table-column>
			<el-table-column label="大小" prop="size">
			</el-table-column>
			<el-table-column label="删除时间" prop="created">
				<template slot-scope="scope">{{ scope.row.deleted | moment}}</template>
			</el-table-column>
			<el-table-column label="有效时间" prop="expired">
				<template slot-scope="scope">{{ scope.row.expire_at | moment}}</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tData: []
		}
	},
	methods: {
		name() {

		}
	},
	mounted() {

	},
}
</script>

<style scoped>
</style>