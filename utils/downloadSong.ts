import JSZip from "jszip";

const formatLRC = (lyric: string) => {
    return `[00:00.00]${lyric}\n`;
};

export default async function (id: number, name: string, cover: string, level: string) {
    const zip = new JSZip();
    const folder = zip.folder(name)!;

    try {
        // 下载封面
        const coverImage: any = await $fetch(cover);
        const coverBlob = await coverImage.arrayBuffer();
        folder.file(`${name}.jpg`, coverBlob);

        // 下载歌词
        const getLyric = await $fetch(`/api/getSongLyric?id=${id}`);
        if (getLyric.code !== 200) {
            return getLyric;
        }
        const lyric = formatLRC(getLyric.lyric);
        folder.file(`${name}.lrc`, lyric);

        // 下载歌曲
        const url = await $fetch(`/api/getSongUrl?id=${id}&level=${level}`);
        if (Number(url.code) !== 200) {
            return url;
        }
        const song: any = await $fetch(url.url);
        const songBlob = await song.arrayBuffer();
        const fileName = `${name}.${url.type}`;
        folder.file(fileName, songBlob);

        // 打包下载
        zip.generateAsync({ type: "blob" })
            .then((zipBlob) => {
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${name}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error({ content: "下载文件失败: " + error });
            });
    } catch (error) {
        console.error(error);
    }
}
