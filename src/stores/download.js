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
            songList: [],
            showMore: false,
            songInfoList: [],
            downloadSchedule: 0, // 下载进度
        };
    },
    actions: {
        // 获取歌单
        async getSongList(id) {
            try {
                const res = await axios.get("https://api.sooooooooooooooooootheby.top/NeteaseCloudMusicApi/playlist/detail", {
                    params: {
                        id,
                    },
                });
                this.songList = res.data.playlist.tracks;
                this.showMore = true;
            } catch (error) {
                notification("获取列表失败: " + error);
            }
        },
        // 获取歌曲的信息
        async getSongDownloadInfo(quality, id, callback) {
            try {
                // const res = await axios.get("https://api.sooooooooooooooooootheby.top/Netease_url/Song_V1", {
                const res = await axios.get("http://127.0.0.1:5000/Song_V1", {
                    params: {
                        level: quality,
                        type: "json",
                        ids: id,
                    },
                });
                this.songInfoList.push({
                    name: res.data.name,
                    author: res.data.ar_name,
                    lyric: res.data.lyric,
                    pic: res.data.pic,
                    url: res.data.url.replace(/^http:\/\//, "https://"),
                });
                if (callback) callback();
            } catch (error) {
                notification("目前有部分音乐无法正常解析, 需要等Api作者回复才有具体解决方法." + "获取歌曲失败: " + error);
            }
        },
        async fetchWithProgress(url, onProgress) {
            const response = await fetch(url);
            const reader = response.body.getReader();
            const contentLength = +response.headers.get("Content-Length"); // 获取内容总长度
            let receivedLength = 0; // 已接收的字节数
            const chunks = []; // 存储下载的字节块

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                // 计算下载进度
                const progress = (receivedLength / contentLength) * 100;
                onProgress(progress); // 调用回调函数更新进度
            }
            return new Blob(chunks); // 将所有块合并为 Blob
        },
        // 下载文件
        async downloadFile(callback) {
            this.downloadSchedule = 0;

            // 格式化LRC歌词
            const formatLRC = (lyric) => {
                return `[00:00.00]${lyric}\n`;
            };

            const downloadBatch = async (list) => {
                // 创建jszip实力
                const zip = new JSZip();

                for (let song of list) {
                    // 文件名
                    const folder = zip.folder(song.name);

                    // 下载封面
                    const picBlob = await this.fetchWithProgress(song.pic, (progress) => {
                        this.downloadSchedule = Math.floor(progress.toFixed(2));
                    });
                    folder.file(`${song.name}.jpg`, picBlob); // 保存图片

                    // 下载歌曲
                    const songBlob = await this.fetchWithProgress(song.url, (progress) => {
                        this.downloadSchedule = Math.floor(progress.toFixed(2));
                    });
                    const fileExtension = song.url.split(".").pop(); // 从 URL 中提取扩展名
                    const fileName = `${song.name}.${fileExtension}`; // 使用歌曲名称和扩展名
                    folder.file(fileName, songBlob); // 保存歌曲

                    // 创建 LRC 格式的歌词
                    const lrcContent = formatLRC(song.lyric);
                    folder.file(`${song.name}.lrc`, lrcContent); // 保存歌词
                    this.downloadSchedule = 100;
                }

                // 打包并下载
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
                    })
                    .catch((error) => {
                        notification("下载文件失败: " + error);
                    });
            };

            for (let i = 0; i < this.songInfoList.length; i += 5) {
                const group = this.songInfoList.slice(i, i + 5);
                downloadBatch(group);
            }
            if (callback) callback();
        },
    },
});
