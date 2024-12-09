<template>
	<div class="songList">
		<div class="url">
			<el-input v-model="url" style="width: 500px" placeholder="请输入歌单的链接或者id" />
		</div>

		<div class="config">
			<el-select v-model="selectedQuality" placeholder="选择音质" style="width: 240px">
				<el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
			<div class="button">
				<el-button @click="getSongList" type="primary" color="#E60026" plain>获取歌单</el-button>
				<el-button @click="downloadSelectSong" v-if="download.showMore" color="#E60026" plain>下载已选</el-button>
				<el-button @click="downloadAllSong" v-if="download.showMore" color="#E60026" plain>下载所有</el-button>
			</div>
			<div class="loading" v-if="getInfo">
				<span>获取音乐信息中...</span>
			</div>
			<div class="download" v-if="downloading">
				<span>下载音乐中</span>
				<el-progress :percentage="parseFloat(download.downloadSchedule)" />
			</div>
		</div>

		<div class="list" v-if="download.showMore">
			<el-table ref="multipleTableRef" @selection-change="handleSelectionChange" empty-text="没有数据" :data="download.songList" style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column label="封面" width="120">
					<template #default="scope">
						<img :src="scope.row.al.picUrl" alt="封面" style="width: 50px; height: 50px" />
					</template>
				</el-table-column>
				<el-table-column property="name" label="名字" />
				<el-table-column property="ar[0].name" label="作者" />
			</el-table>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import { downloadStore } from "@/stores/download.js";
const download = downloadStore();
import { Icon } from "@iconify/vue";

// 通知-错误
const notification = (message) => {
	ElNotification({
		title: "Error",
		message: message,
		type: "error",
	});
};

// 输入的url或者id
const url = ref("");
// const url = ref("https://music.163.com/#/my/m/music/playlist?id=12763433746");
// 判断输入的是url还是id
const getSongList = () => {
	const urlRegex = /https:\/\/music\.163\.com\/#\/my\/m\/music\/playlist\?id=(\d+)/;
	const idRegex = /^\d+$/;

	if (urlRegex.test(url.value)) {
		const match = url.value.match(urlRegex);
		download.getSongList(match[1]);
	} else if (idRegex.test(url.value)) {
		download.getSongList(url.value);
	} else {
		notification("请输入正确的歌单链接或者id");
	}
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

// 获取选择的歌曲
const selectedSong = ref([]);
const handleSelectionChange = (e) => {
	selectedSong.value = e.map((item) => item.id);
};

// 下载
const getInfo = ref(false);
const downloading = ref(false);
const downloadSelectSong = async () => {
	if (!selectedQuality.value) {
		return notification("请选择音质");
	} else if (!selectedSong.value.length) {
		return notification("请选择歌曲");
	}
	getInfo.value = true;

	const songPromises = selectedSong.value.map((item) => download.getSongDownloadInfo(selectedQuality.value, item));
	await Promise.all(songPromises);
	getInfo.value = false;
	downloading.value = true;
	download.downloadFile(download.songInfoList, () => {
		downloading.value = false;
	});
};

const downloadAllSong = async () => {
	if (!selectedQuality.value) {
		return notification("请选择音质");
	}
	getInfo.value = true;

	const songPromises = download.songList.map((item) => download.getSongDownloadInfo(selectedQuality.value, item.id));
	await Promise.all(songPromises);
	getInfo.value = false;
	downloading.value = true;
	download.downloadFile(download.songInfoList, () => {
		downloading.value = false;
	});
};
</script>

<style lang="scss" scoped>
.songList {
	margin-top: 20px;
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
}
</style>
