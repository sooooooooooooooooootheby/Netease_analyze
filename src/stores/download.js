import { defineStore } from "pinia";
import axios from "axios";
import { ElNotification } from "element-plus";
import JSZip from "jszip";

// 通知-错误
const notification = (message) => {
	ElNotification({
		title: "Error",
		message: message,
		type: "error",
	});
};

export const downloadStore = defineStore("download", {
	state: () => {
		return {
			songInfoList: [],
			downloadSchedule: 0, // 下载进度
		};
	},
	actions: {
		// 获取歌曲的信息
		async getSongDownloadInfo(quality, id, callback) {
			try {
				const res = await axios.get("https://api.sooooooooooooooooootheby.top/Netease_url/Song_V1", {
					params: {
						level: quality,
						type: "json",
						url: `https://music.163.com/#/song?id=${id}`,
					},
				});
				this.songInfoList.push({
					name: res.data.name,
					author: res.data.ar_name,
					lyric: res.data.lyric,
					pic: res.data.pic,
					url: res.data.url,
				});
				if (callback) callback();
			} catch (error) {
				notification("获取歌曲失败: " + error);
			}
		},
		// 下载文件
		async downloadFile(list, callback) {
			// 创建jszip对象
			const zip = new JSZip();

			// 方法：格式化 LRC 歌词
			const formatLRC = (lyric) => {
				return `[00:00.00]${lyric}\n`;
			};

			// 遍历数组中的所有歌曲
			for (let song of list) {
				const folder = zip.folder(song.name); // 每个歌曲文件夹以 name 命名
				this.downloadSchedule = 0;

				// 下载图片
				const picResponse = await fetch(song.pic);
				const picBlob = await picResponse.blob();
				folder.file(`${song.name}.jpg`, picBlob); // 保存图片
				this.downloadSchedule = 25;

				// 下载歌曲
				const songResponse = await fetch(song.url);
				const songBlob = await songResponse.blob();
				this.downloadSchedule = 50;

				// 获取文件扩展名
				const fileExtension = song.url.split(".").pop(); // 从 URL 中提取扩展名
				const fileName = `${song.name}.${fileExtension}`; // 使用歌曲名称和扩展名
				folder.file(fileName, songBlob); // 保存歌曲
				this.downloadSchedule = 90;

				// 创建 LRC 格式的歌词
				const lrcContent = formatLRC(song.lyric);
				folder.file(`${song.name}.lrc`, lrcContent); // 保存歌词
				this.downloadSchedule = 100;
			}

			this.downloadSchedule = 0;

			// 生成 ZIP 文件并下载，同时更新进度条
			zip.generateAsync({ type: "blob" }, (metadata) => {
				// 更新下载进度
				this.downloadSchedule = Math.floor(metadata.percent.toFixed(2));
			})
				.then((zipBlob) => {
					const url = URL.createObjectURL(zipBlob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `songs.zip`; // 下载的 ZIP 文件名
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url); // 释放对象 URL

					// 下载完成后将进度重置为 0
					this.downloadSchedule = 0;
					if (callback) callback();
				})
				.catch((error) => {
					notification("下载文件失败: " + error);
				});
		},
	},
});
