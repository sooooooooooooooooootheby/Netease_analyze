<template>
	<div class="playList">
		<form @submit.prevent="getPlayList">
			<label for="playListId">
				<Icon icon="iconamoon:attachment-fill" />
				<input type="text" id="playListId" v-model="playListId" placeholder="请输入歌单的链接或ID" />
			</label>

			<button type="submit">获取歌单</button>
		</form>

		<div class="list" v-if="playList.length > 0">
			<div class="toneQuality">
				<span>选择音质</span>
				<label>
					<input type="radio" value="standard" v-model="toneQuality" />
					<span>标准 (free)</span>
				</label>
				<label>
					<input type="radio" value="exhigh" v-model="toneQuality" />
					<span>极高 (free)</span>
				</label>
				<label>
					<input type="radio" value="lossless" v-model="toneQuality" />
					<span>无损 (vip)</span>
				</label>
				<label>
					<input type="radio" value="hires" v-model="toneQuality" />
					<span>Hi-Res (vip)</span>
				</label>
				<label>
					<input type="radio" value="jyeffect" v-model="toneQuality" />
					<span>高清环绕声 (svip)</span>
				</label>
				<label>
					<input type="radio" value="sky" v-model="toneQuality" />
					<span>沉浸环绕声 (svip)</span>
				</label>
				<label>
					<input type="radio" value="jymaster" v-model="toneQuality" />
					<span>超清母带 (svip)</span>
				</label>
			</div>

			<div class="downloadButton">
				<span>下载</span>
				<button @click="downloadAllSong">下载全部</button>
				<button @click="downloadSelectSong">下载已选</button>
			</div>

			<ul class="singList">
				<span>音乐列表</span>
				<label :for="item.id" v-for="item in playList" :key="item.id">
					<input type="checkbox" :id="item.id" name="song" v-model="selectSong" :value="item.id" />
					<li>
						<img :src="item.al.picUrl" alt="cover" />
						<span>{{ item.name }}</span>
					</li>
				</label>
			</ul>
		</div>
	</div>
</template>

<script setup>
import axios from "axios";
import autolog from "autolog.js";
import JSZip from "jszip";
import { ref } from "vue";
import { Icon } from "@iconify/vue";

// 获取列表部分
// 用户输入
// const playListId = ref("12716349287");
// const playListId = ref("https://music.163.com/#/my/m/music/playlist?id=12716349287");
const playListId = ref("");
// 所有的歌曲列表
const playList = ref([]);

// 发送获取歌单请求
const sendRequest = async (id) => {
	try {
		const res = await axios.get("https://netease.sooooooooooooooooootheby.top/NeteaseCloudMusicApi/playlist/detail", {
			params: {
				id,
			},
		});
		playList.value = res.data.playlist.tracks;
	} catch (error) {
		console.error(error);
	}
};
// 判断输入的是url还是id
const getPlayList = () => {
	const urlRegex = /https:\/\/music\.163\.com\/#\/my\/m\/music\/playlist\?id=(\d+)/;
	const idRegex = /^\d+$/;

	if (urlRegex.test(playListId.value)) {
		const match = playListId.value.match(urlRegex);
		sendRequest(match[1]);
	} else if (idRegex.test(playListId.value)) {
		sendRequest(playListId.value);
	} else {
		autolog.log("格式错误", "error");
	}
};

// 下载部分
// 选择音质
const toneQuality = ref("standard");
// 选择的歌曲
const selectSong = ref([]);
// 获取的歌曲信息
const songInfoList = ref([]);

// 打包下载
const downloadZip = async () => {
	// 创建jszip对象
	const zip = new JSZip();

	// 方法：格式化 LRC 歌词
	const formatLRC = (lyric) => {
		return `[00:00.00]${lyric}\n`;
	};

	// 便利数组中的所有歌曲
	for (let song of songInfoList.value) {
		const folder = zip.folder(song.name); // 每个歌曲文件夹以 name 命名

		// 下载图片
		const picResponse = await fetch(song.pic);
		const picBlob = await picResponse.blob();
		folder.file(`${song.name}.jpg`, picBlob); // 保存图片

		// 下载歌曲
		const songResponse = await fetch(song.url);
		const songBlob = await songResponse.blob();
		// 获取文件扩展名
		const fileExtension = song.url.split(".").pop(); // 从 URL 中提取扩展名
		const fileName = `${song.name}.${fileExtension}`; // 使用歌曲名称和扩展名
		folder.file(fileName, songBlob); // 保存歌曲

		// 创建 LRC 格式的歌词
		const lrcContent = formatLRC(song.lyric);
		folder.file(`${song.name}.lrc`, lrcContent); // 保存歌词

		// 生成 ZIP 文件并下载
		zip.generateAsync({ type: "blob" }).then((zipBlob) => {
			const url = URL.createObjectURL(zipBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${song.name}.zip`; // 下载的 ZIP 文件名
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url); // 释放对象 URL
		});
	}
};
// 获取歌曲下载信息
const getSongUrl = async (id) => {
	try {
		const res = await axios.get("https://netease.sooooooooooooooooootheby.top/Netease_url/Song_V1", {
			params: {
				level: toneQuality.value,
				type: "json",
				url: `https://music.163.com/#/song?id=${id}`,
			},
		});
		songInfoList.value.push({
			name: res.data.name,
			author: res.data.ar_name,
			lyric: res.data.lyric,
			pic: res.data.pic,
			url: res.data.url,
		});
	} catch (error) {
		autolog.log("获取链接失败", "error");
	}
};
// 下载所有的歌曲
const downloadAllSong = async () => {
	const songPromises = playList.value.map((item) => getSongUrl(item.id));
	await Promise.all(songPromises);
	downloadZip();
};

// 下载选择的歌曲
const downloadSelectSong = async () => {
	const songPromises = selectSong.value.map((item) => getSongUrl(item));
	await Promise.all(songPromises);
	downloadZip();
};
</script>

<style lang="scss" scoped>
@import url("style/components/playList.scss");
</style>
