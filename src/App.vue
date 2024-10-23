<template>
	<div class="common-layout">
		<el-container>
			<el-header>
				<Icon class="icon" icon="simple-icons:neteasecloudmusic" />
				<span class="title"> 网易云无损解析 </span>
			</el-header>
			<el-main>
				<div class="bar">
					<el-radio-group v-model="page" fill="#E60026">
						<el-radio-button label="歌单模式" value="songList" />
						<el-radio-button label="单曲模式" value="single" />
						<el-radio-button label="关于" value="about" />
					</el-radio-group>
					<a href="https://github.com/sooooooooooooooooootheby/Netease_analyze" target="_blank">
						<el-button type="primary" color="#E60026" plain>Github</el-button>
					</a>
				</div>
				<songList v-if="page === 'songList'" />
				<single v-if="page === 'single'" />
				<about v-if="page === 'about'" />
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import songList from "@/components/songList.vue";
import single from "@/components/single.vue";
import about from "@/components/about.vue";

const page = ref("single");
</script>

<style lang="scss" scoped>
@import "style/handle.scss";

.el-header {
	height: 64px;
	padding: 0 64px;
	border-bottom: 2px dashed var(--el-border-color);
	@include flex-center($direction: row, $content: start);

	.icon {
		font-size: 2rem;
		color: $neteaseColor;
	}
	.title {
		margin-left: 24px;
		font-size: 1.1rem;
		font-weight: bold;
	}
}
.el-main {
	height: calc(100vh - 64px);
	.bar {
		display: flex;
		.el-button {
			margin-left: 12px;
		}
	}
}
</style>
