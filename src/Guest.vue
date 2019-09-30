<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {

}
</script>

<style>
* {
	margin: 0;
	padding: 0;
}
html,
body {
	width: 100%;
	height: 100%;
}

#app {
	height: 100%;
	background-color: #fafafa;
}

.el-card__header {
	text-align: center;
	border-bottom: none !important;
}
.el-card__header .title {
	font-size: 20px;
	margin-top: 10px;
}
.el-card__header .icon {
	font-size: 30px;
	color: #f50057;
}
</style>