<template>
	<div class="main">
		<div class="title">
			<span class="main_title">网易云音乐无损解析服务</span>
			<span class="sub_title">一个简单的无损音乐下载站点</span>
		</div>

		<div class="container">
			<input type="radio" id="radio-1" name="tabs" checked="" @click="model = 0" />
			<label class="tab" for="radio-1">歌单模式</label>
			<input type="radio" id="radio-2" name="tabs" @click="model = 1" />
			<label class="tab" for="radio-2">单曲模式</label>
			<input type="radio" id="radio-3" name="tabs" @click="model = 99" />
			<label class="tab" for="radio-3">关于</label>
			<a href="https://github.com/sooooooooooooooooootheby/Netease_analyze" target="_block">Github<Icon icon="iconamoon:arrow-top-right-3-square-fill" /></a>
		</div>

		<playList v-if="model === 0" />
		<single v-else-if="model === 1" />
		<about v-else-if="model === 99" />
	</div>
</template>

<script setup>
import playList from "./playList.vue";
import single from "./single.vue";
import about from "./about.vue";
import { Icon } from "@iconify/vue";
import { ref } from "vue";

/*
	0 是歌单模式
	1 是单曲模式
	99 是关于页
*/
const model = ref(0);
</script>

<style lang="scss" scoped>
@import url("style/components/main.scss");
</style>
