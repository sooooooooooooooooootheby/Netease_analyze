import { song } from "~/types";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { id } = getQuery(event) as { id: string };

    const url = "https://music.163.com/api/v3/song/detail";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://music.163.com/",
        Origin: "https://music.163.com",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: config.cookie,
    };
    const params = new URLSearchParams();
    params.append("c", JSON.stringify([{ id: id, v: 0 }]));

    try {
        const response: any = await $fetch(url, {
            method: "POST",
            headers,
            body: params.toString(),
            parseResponse: (text) => text,
        });
        const firstJson = response.match(/^\{.*?\}(?=\{|$)/s)?.[0];
        const result = firstJson ? JSON.parse(firstJson) : null;

        if (result.code !== 200) {
            throw createError({
                statusCode: result.code,
                message: result.msg,
            });
        }

        const song: song = {
            name: result.songs[0].name,
            id: result.songs[0].id,
            author: result.songs[0].ar.map((item: any) => ({
                id: item.id,
                name: item.name,
            })),
            album: {
                id: result.songs[0].al.id,
                name: result.songs[0].al.name,
                cover: result.songs[0].al.picUrl,
            },
        };

        return song;
    } catch (error) {
        console.error("[NCM API] 获取歌曲信息失败:", error);
        throw error;
    }
});
