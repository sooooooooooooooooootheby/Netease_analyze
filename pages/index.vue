<template>
    <div class="flex h-screen w-full items-center justify-center p-12 max-md:h-auto max-md:flex-col max-md:p-6">
        <div class="flex h-full flex-col max-md:size-full">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-md max-md:w-full">
                <legend class="fieldset-legend">歌单模式</legend>

                <label class="fieldset-label">歌单的链接</label>
                <input type="text" class="input focus:outline-none max-md:w-full" v-model="input" />

                <button class="btn btn-neutral mt-4" @click="getList(input)" :class="{ 'btn-disabled': isLoading }">
                    获取
                    <div class="loading loading-xs" v-if="isLoading"></div>
                </button>
                <div role="alert" class="alert alert-error alert-soft" v-if="isLoadingPlaylistError">
                    <span>获取歌单失败, 请检查链接或者联系管理员.</span>
                </div>
            </fieldset>
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box mt-6 h-full w-xs overflow-scroll border p-4 shadow-md max-md:w-full" v-if="playlist">
                <legend class="fieldset-legend">歌单信息</legend>

                <div class="flex">
                    <div class="relative h-32 w-30 text-slate-200">
                        <div class="bg-base-300 absolute left-2 h-26 w-26 rounded-xl"></div>
                        <img :src="playlist.coverImage" alt="cover" class="absolute top-2 h-30 w-30 rounded-xl" />
                        <div class="absolute right-4 bottom-2 z-2 flex items-center">
                            <Icon name="akar-icons:music" />
                            <span class="ml-1 text-sm">{{ playlist.songCount ? playlist.songCount : 0 }}</span>
                        </div>
                    </div>
                    <div class="ml-4 flex w-30 grow flex-col flex-wrap">
                        <p class="mb-2 text-2xl font-bold break-words">
                            {{ playlist.name }}
                        </p>
                        <div class="flex items-center">
                            <div class="avatar">
                                <div class="w-6 rounded-full">
                                    <img :src="playlist.creator.avatar" alt="avatar" />
                                </div>
                            </div>
                            <a :href="`https://music.163.com/#/user/home?id=${playlist.creator.uid}`" target="_blank" class="ml-2 flex cursor-pointer items-center text-slate-400">
                                <span class="mr-1">{{ playlist.creator.name }}</span>
                                <Icon name="akar-icons:chevron-right-small" />
                            </a>
                        </div>
                    </div>
                </div>

                <div class="my-2">
                    <p class="text-sm text-slate-500">
                        {{ playlist.description }}
                    </p>
                    <div class="badge badge-soft badge-accent badge-xs" v-for="item in playlist.tags" :key="item">
                        {{ item }}
                    </div>
                </div>
            </fieldset>
        </div>

        <fieldset class="fieldset bg-base-200 rounded-box border-base-300 ml-6 h-full grow overflow-scroll border shadow-md max-md:mt-6 max-md:ml-0 max-md:w-full" v-if="songlist.length !== 0">
            <legend class="fieldset-legend pl-4">歌曲列表</legend>

            <ul class="list">
                <li class="flex p-4 pb-2 text-xs tracking-wide opacity-60 max-md:flex-col">
                    <div class="grow">
                        <span>选择你想要的歌曲</span>
                        <span v-if="selectedlist.length !== 0" class="ml-2"> 已选 {{ selectedlist.length }} 首 </span>
                    </div>
                    <div class="mr-2 max-md:my-2">
                        <select class="select select-xs focus:outline-none" v-model="level">
                            <option value="standard">标准音质</option>
                            <option value="exhigh">极高音质</option>
                            <option value="lossless">无损音质</option>
                            <option value="hires">Hires音质</option>
                            <option value="sky">沉浸环绕声</option>
                            <option value="jyeffect">高清环绕声</option>
                            <option value="jymaster">超清母带</option>
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-xs" @click="downloadAll(songlist)" onclick="download_modal.showModal()">下载全部</button>
                        <button class="btn btn-xs ml-2" v-if="selectedlist.length !== 0" @click="downloadSelected(selectedlist)" onclick="download_modal.showModal()">下载已选</button>
                        <button class="btn btn-xs ml-2" onclick="download_modal.showModal()"><Icon name="akar-icons:cloud-download" /></button>
                    </div>
                </li>
                <li class="list-row" v-for="(item, index) in songlist" :key="item.id">
                    <div class="text-sm font-thin tabular-nums opacity-30">
                        {{ index + 1 }}
                    </div>
                    <div>
                        <img class="rounded-box size-10" :src="item.album.cover" alt="cover" />
                    </div>
                    <div class="list-col-grow">
                        <div>{{ item.name }}</div>
                        <div class="text-xs font-semibold uppercase opacity-60">
                            <span v-for="(ar, i) in item.author">
                                {{ ar.name }}
                                <span v-if="i < item.author.length - 1">, </span>
                            </span>
                        </div>
                    </div>
                    <input type="checkbox" class="checkbox" v-model="selectedlist" :value="{ id: item.id, name: item.name, cover: item.album.cover, status: 'await' }" />
                </li>
                <li class="mx-auto mt-4" v-if="isLoadingSonglist">
                    <div class="loading loading-sm"></div>
                </li>
            </ul>
        </fieldset>
        <dialog id="download_modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box max-h-100">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
                </form>
                <h3 class="text-lg font-bold">下载列表</h3>
                <div class="py-4">
                    <ul class="list" v-if="downloadlist.length > 0">
                        <li class="list-row" v-for="item in downloadlist" :key="item.id">
                            <div><img class="rounded-box size-10" :src="item.cover" /></div>
                            <div>
                                <div>{{ item.name }}</div>
                                <div class="text-xs">
                                    <span v-if="item.status === 'await'">等待</span>
                                    <span v-else-if="item.status === 'downloading'">下载中</span>
                                    <span v-else-if="item.status === 'check'">下载完成</span>
                                    <span v-else>出错</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-center">
                                <Icon class="text-base" name="akar-icons:alarm" v-if="item.status === 'await'" />
                                <div class="loading loading-xs" v-else-if="item.status === 'downloading'"></div>
                                <Icon class="text-base text-green-500" name="akar-icons:circle-check" v-else-if="item.status === 'check'" />
                                <Icon class="text-base text-red-500" name="akar-icons:circle-alert" v-else />
                            </div>
                        </li>
                    </ul>
                    <span class="text-sm opacity-70" v-else>下载列表还没有歌曲哦</span>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script lang="ts" setup>
const input = ref<string>(""); // https://y.music.163.com/m/playlist?id=12763433746
const level = ref<string>("standard");
const playlist = ref<playlist | null>(null);
const songlist = ref<Array<song>>([]);
const selectedlist = ref<Array<download>>([]);
const downloadlist = ref<Array<download>>([]);

const getSong = async (id: number) => {
    try {
        const result = await $fetch(`/api/getSongInfo?id=${id}`);
        songlist.value.push(result);
    } catch (error) {
        console.error(error);
    }
};

const isLoading = ref<boolean>(false);
const isLoadingSonglist = ref<boolean>(false);
const isLoadingPlaylistError = ref<boolean>(false);

const getList = async (url: string) => {
    if (!url) {
        return;
    }

    isLoading.value = true;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const id = params.get("id");

    try {
        const result = await $fetch(`/api/getPlaylist?id=${id}`) as any as playlist;
        playlist.value = result;
        songlist.value = [];
        isLoadingSonglist.value = true;

        for (const item of result.list) {
            getSong(item.id);
        }
        isLoadingPlaylistError.value = false;
    } catch (error) {
        console.error(error);
        isLoadingPlaylistError.value = true;
    } finally {
        isLoading.value = false;
        isLoadingSonglist.value = false;
    }
};

const downloadfunc = async (list: Array<download>) => {
    for (let i: number = 0; i < list.length; i++) {
        try {
            downloadlist.value[i].status = "downloading";
            const { id, name, cover } = list[i];
            await downloadSong(id, name, cover, level.value);
            downloadlist.value[i].status = "check";
            await $fetch("https://api.s22y.moe/count/add?name=neteasy", {
                method: "POST",
            });
        } catch (error) {
            console.error();
            downloadlist.value[i].status = "error";
        }
    }
};

const downloadAll = async (list: Array<song>) => {
    downloadlist.value = [];
    list.forEach((item) => {
        downloadlist.value.push({
            id: item.id,
            name: item.name,
            cover: item.album.cover,
            status: "await",
        });
    });
    downloadfunc(downloadlist.value);
};

const downloadSelected = async (list: Array<download>) => {
    downloadlist.value = [];
    list.forEach((item) => {
        downloadlist.value.push({
            id: item.id,
            name: item.name,
            cover: item.cover,
            status: "await",
        });
    });
    downloadfunc(downloadlist.value);
};
</script>
