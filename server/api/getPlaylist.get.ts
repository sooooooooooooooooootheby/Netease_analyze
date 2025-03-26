import { playlist } from "~/types";

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event) as { id: string };

    //12763433746, 13246943556
    try {
        const result: any = await $fetch(`https://music.163.com/api/v6/playlist/detail?id=${id}`, {
            parseResponse: JSON.parse,
        });

        if (result.code !== 200) {
            throw createError({
                statusCode: result.code,
                message: result,
            });
        }

        const playlist: playlist = {
            code: result.code,
            name: result.playlist.name,
            coverImage: result.playlist.coverImgUrl,
            songCount: result.playlist.trackCount,
            description: result.playlist.description,
            tags: result.playlist.tags,
            creator: {
                uid: result.playlist.creator.userId,
                avatar: result.playlist.creator.avatarUrl,
                name: result.playlist.creator.nickname,
            },
            list: result.playlist.trackIds.map((item: any) => ({
                id: item.id,
            })),
        };

        return playlist;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error,
        });
    }
});
