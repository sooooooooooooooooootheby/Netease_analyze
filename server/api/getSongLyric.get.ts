import { lyric } from "~/types";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { id } = getQuery(event) as { id: string };

    const url = "https://music.163.com/api/song/lyric";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://music.163.com/",
        Origin: "https://music.163.com",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: config.cookie,
    };
    const params = new URLSearchParams({
        id,
        cp: "false",
        tv: "0",
        lv: "0",
        rv: "0",
        kv: "0",
        yv: "0",
        ytv: "0",
        yrv: "0",
    });

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

        const lyric: lyric = {
            code: result.code,
            lyric: result.lrc.lyric,
        };

        return lyric;
    } catch (error) {
        console.error("[NCM API] 获取歌曲信息失败:", error);
        throw error;
    }
});
