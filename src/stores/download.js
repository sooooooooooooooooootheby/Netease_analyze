import { defineStore } from "pinia";
import axios from "axios";
import JSZip from "jszip";
import { message } from "ant-design-vue";

export const downloadStore = defineStore("download", {
    state: () => {
        return {};
    },
    actions: {
        // 获取歌曲信息
        async getSongInfo(quality, id) {
            try {
                const res = await axios.get("https://api.sooooooooooooooooootheby.top/Netease_url/Song_V1", {
                    params: {
                        level: quality,
                        type: "json",
                        ids: id,
                    },
                });
                if (res.data.status !== 200) {
                    return message.error({ content: "获取列表失败 " + error });
                }
                return res.data;
            } catch (error) {
                message.error({ content: "获取列表失败 " + error });
            }
        },
        // 下载歌曲
        async downloadSong(song, callback) {
            // 格式化LRC歌词
            const formatLRC = (lyric) => {
                return `[00:00.00]${lyric}\n`;
            };
            // 创建jszip实例
            const zip = new JSZip();
            // 文件名
            const folder = zip.folder(song.name);

            // 下载封面
            const picResponse = await fetch(song.pic);
            const picBlob = await picResponse.blob();
            folder.file(`${song.name}.jpg`, picBlob);

            // 下载歌曲
            const songResponse = await fetch(song.url);
            const songBlob = await songResponse.blob();
            const fileExtension = song.url.split(".").pop();
            const fileName = `${song.name}.${fileExtension}`;
            folder.file(fileName, songBlob);

            // 创建 LRC 格式的歌词
            const lrcContent = formatLRC(song.lyric);
            folder.file(`${song.name}.lrc`, lrcContent);

            // 打包下载
            zip.generateAsync({ type: "blob" })
                .then((zipBlob) => {
                    const url = URL.createObjectURL(zipBlob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${song.name}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    if (callback) {
                        callback();
                    }
                })
                .catch((error) => {
                    message.error({ content: "下载文件失败: " + error });
                });
        },
    },
});
