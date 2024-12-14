<template>
    <a-config-provider
        :theme="{
            token: {
                colorPrimary: '#EC4141',
            },
        }"
    >
        <div class="list">
            <a-card class="control">
                <div style="display: flex; flex-direction: column">
                    <p class="title">歌单模式</p>
                    <a-input class="input" v-model:value="value" placeholder="输入歌单链接或者ID" />
                    <a-alert class="alert" message="输入的链接或者ID不正确" type="error" closable v-if="isValueError" />
                    <a-button type="primary" @click="handleValue"> 获取列表 </a-button>
                </div>
                <a-divider v-if="data.length" />
                <div style="display: flex; flex-direction: column" v-if="data.length">
                    <a-select ref="select" v-model:value="quality">
                        <a-select-option value="standard">标准</a-select-option>
                        <a-select-option value="exhigh">极高</a-select-option>
                        <a-select-option value="lossless">无损</a-select-option>
                        <a-select-option value="hires">Hi-Res</a-select-option>
                        <a-select-option value="jyeffect">高清环绕声</a-select-option>
                        <a-select-option value="sky">沉积环绕声</a-select-option>
                        <a-select-option value="jymaster">超清母带</a-select-option>
                    </a-select>
                    <a-button style="margin: 12px 0" type="primary" @click="downloadSong"> 下载列表所有歌曲 </a-button>
                    <div style="display: flex; justify-content: space-between; align-items: center" v-if="selectedData.length">
                        <a-button type="primary" @click="downloadSelectedSong" style="margin-right: 12px"> 下载已选 </a-button>
                        <p>已选择 {{ selectedData.length }} 首歌曲</p>
                    </div>
                </div>
            </a-card>
            <a-card class="song" v-if="data.length">
                <a-list item-layout="horizontal" :data-source="data">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta :description="handleAr(item.ar)">
                                <template #title>
                                    <a href="https://www.antdv.com/">{{ item.name }}</a>
                                </template>
                                <template #avatar>
                                    <a-avatar style="width: 48px; height: 48px" :src="item.al.picUrl" />
                                </template>
                            </a-list-item-meta>
                            <div class="buttonBox">
                                <a-button style="margin-left: 12px" @click="selectedData.push(item.id)" v-if="!isSelected(item.id)">选择</a-button>
                                <a-button style="margin-left: 12px" @click="selectedData.splice(selectedData.indexOf(item.id), 1)" v-else danger>删除</a-button>
                            </div>
                        </a-list-item>
                    </template>
                </a-list>
            </a-card>
        </div>
    </a-config-provider>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { downloadStore } from "../stores/download";

const download = downloadStore();
// const value = ref("");
const value = ref("https://music.163.com/playlist?id=8301970181&userid=480428722");
// const value = ref("https://music.163.com/playlist?id=12763433746&userid=480428722");
const quality = ref("standard");
const isValueError = ref(false);
const data = ref([]);
const selectedData = ref([]);
const keyLoadList = "getList";
const keySongInfo = "getSongInfo";

const getList = async (id) => {
    message.loading({ content: "获取歌单中...", key: keyLoadList });
    try {
        const res = await axios.get("https://api.sooooooooooooooooootheby.top/NeteaseCloudMusicApi/playlist/detail", {
            params: {
                id,
            },
        });
        data.value = res.data.playlist.tracks;
        message.success({ content: "获取歌单成功", key: keyLoadList });
        if (isValueError) {
            isValueError.value = false;
        }
    } catch (error) {
        message.error({ content: "获取歌单失败 " + error, key: keyLoadList });
    }
};

const downloadSong = async () => {
    message.loading({ content: "下载歌曲中... ", key: keySongInfo });
    try {
        for (const item of data.value) {
            const info = await download.getSongInfo(quality.value, item.id);
            download.downloadSong(info);
        }
        message.success({ content: "下载歌曲成功", key: keySongInfo });
    } catch (error) {
        message.error({ content: "下载歌曲失败 " + error, key: keySongInfo });
    }
};

const downloadSelectedSong = async () => {
    message.loading({ content: "下载歌曲中... ", key: keySongInfo });
    try {
        for (const item of selectedData.value) {
            const info = await download.getSongInfo(quality.value, item);
            download.downloadSong(info);
        }
        message.success({ content: "下载歌曲成功", key: keySongInfo });
    } catch (error) {
        message.error({ content: "下载歌曲失败 " + error, key: keySongInfo });
    }
};

const handleValue = async () => {
    const urlRegex = /https?:\/\/[^\s]+/;
    const idRegex = /^\d+$/;

    if (value.value.match(urlRegex)) {
        const urlParams = new URL(value.value).searchParams;
        const id = urlParams.get("id");
        getList(id);
        return;
    }
    if (value.value.match(idRegex)) {
        getList(value.value);
        return;
    }
    isValueError.value = true;
};

const handleAr = (ar) => {
    let info = "";
    if (ar.length === 0) {
        return "未知作者";
    }
    ar.forEach((item) => {
        info += item.name + " ";
    });
    return info;
};

const isSelected = (id) => {
    return selectedData.value.includes(id);
};
</script>

<style lang="scss" scoped>
.list {
    display: flex;
    max-height: 600px;
    .control {
        width: 500px;
        .title {
            font-weight: bold;
            font-size: 1.4rem;
        }
        .input {
            margin: 12px 0;
        }
        .alert {
            margin-bottom: 12px;
        }
    }
    .song {
        width: 700px;
        margin-left: 12px;
        overflow: scroll;
    }
    .song::-webkit-scrollbar {
        display: none;
    }
}

@media screen and (max-width: 768px) {
    .list {
        width: 90vw;
        max-height: 100vh;
        flex-direction: column;
        padding-top: 128px;

        .control {
            width: 100%;
            height: auto;
        }
        .song {
            width: 100%;
            max-height: 1000vh;
            margin: 12px 0 0 0;
        }
    }
}
</style>
