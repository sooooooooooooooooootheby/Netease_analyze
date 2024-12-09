<template>
	<div class="single">
		<div class="url">
			<el-input v-model="url" style="width: 500px" placeholder="请输入歌曲的链接或者id" />
		</div>

		<div class="config">
			<el-select v-model="selectedQuality" placeholder="选择音质" style="width: 240px">
				<el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<div class="button">
				<el-button @click="getSongList" type="primary" color="#E60026" plain>获取歌曲</el-button>
				<el-button @click="downloadSong" v-if="loaded" type="primary" color="#E60026" plain>下载歌曲</el-button>
			</div>
			<div class="loading" v-if="getInfo">
				<span>获取音乐信息中...</span>
			</div>
			<div class="download" v-if="downloading">
				<span>下载音乐中</span>
				<el-progress :percentage="parseFloat(download.downloadSchedule)" />
			</div>
		</div>

		<div class="songInfo" v-if="loaded">
			<div class="cover">
				<img :src="download.songInfoList[0].pic" alt="封面" />
			</div>
			<div class="info">
				<p class="title">{{ download.songInfoList[0].name }}</p>
				<p class="author">{{ download.songInfoList[0].author }}</p>
			</div>
			<div class="background">
				<img :src="download.songInfoList[0].pic" alt="背景" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { ElNotification } from "element-plus";
import { downloadStore } from "@/stores/download.js";
const download = downloadStore();

// 通知-错误
const notification = (message) => {
	ElNotification({
		title: "Error",
		message: message,
		type: "error",
	});
};

// 选择的音质
const selectedQuality = ref("standard");
const quality = [
	{
		value: "standard",
		label: "标准",
	},
	{
		value: "exhigh",
		label: "极高",
	},
	{
		value: "lossless",
		label: "无损",
	},
	{
		value: "hires",
		label: "Hi-Res",
	},
	{
		value: "jyeffect",
		label: "高清环绕声",
	},
	{
		value: "sky",
		label: "沉积环绕声",
	},
	{
		value: "jymaster",
		label: "超清母带",
	},
];

// 输入的url或者id
// const url = ref("");
const url = ref("https://music.163.com/#/song?id=1830190033");
const loaded = ref(false);
const getInfo = ref(false);
// 判断输入的是url还是id
const getSongList = () => {
	const urlRegex = /https:\/\/music\.163\.com\/#\/song\?id=(\d+)/;
	const idRegex = /^\d+$/;
	getInfo.value = true;

	if (urlRegex.test(url.value)) {
		const match = url.value.match(urlRegex);
		download.getSongDownloadInfo(selectedQuality.value, match[1], () => {
			loaded.value = true;
			ElNotification({
				title: "嗨!",
				message: "我想给单曲解析添加一个音乐播放器的功能, 目前还没开始动工, 应该会鸽一段时间, 如果你有兴趣, 欢迎来帮助我完成它",
				duration: 0,
			});
			getInfo.value = false;
		});
	} else if (idRegex.test(url.value)) {
		download.getSongDownloadInfo(selectedQuality.value, url.value, () => {
			loaded.value = true;
			ElNotification({
				title: "嗨!",
				message: "我想给单曲解析添加一个音乐播放器的功能, 目前还没开始动工, 应该会鸽一段时间, 如果你有兴趣, 欢迎来帮助我完成它",
				duration: 0,
			});
			getInfo.value = false;
		});
	} else {
		notification("请输入正确的歌单链接或者id");
	}
};

// 下载
const downloading = ref(false);
const downloadSong = () => {
	downloading.value = true;
	download.downloadFile(download.songInfoList, () => {
		downloading.value = false;
	});
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/handle.scss";
.single {
	height: calc(100vh - 66px - 64px - 40px);
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	.el-button {
		margin-left: 12px;
	}
	> div {
		margin-bottom: 12px;
	}
	.url {
		.el-input {
			width: 100% !important;
		}
	}
	.config {
		.button {
			margin-top: 12px;
			.el-button {
				margin-left: 0;
				margin-right: 12px;
			}
		}
	}
	.songInfo {
		width: 100%;
		height: 100%;
		margin: 0;
		border-radius: 12px;
		position: relative;
		overflow: hidden;
		@include flex_center;
		.cover {
			img {
				width: 400px;
				height: 400px;
				border-radius: 12px;
			}
		}
		.info {
			width: 400px;
			height: auto;
			margin-top: 12px;
			@include flex_center;
			.title {
				font-size: 1.6rem;
				font-weight: bold;
			}
		}
		.background {
			width: 100vw;
			position: absolute;
			top: -50%;
			left: 0;
			z-index: -1;
			filter: blur(100px) brightness(0.75);
			img {
				width: 100%;
			}
		}
	}
}

@media (max-width: 900px) {
	.single {
		.songInfo {
			.background {
				display: none;
			}
		}
	}
}
</style>
