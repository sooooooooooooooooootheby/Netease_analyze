<template>
    <a-config-provider
        :theme="{
            token: {
                colorPrimary: '#EC4141',
            },
        }"
    >
        <a-card class="control">
            <p class="title">单曲模式</p>
            <a-input class="input" v-model:value="value" placeholder="输入歌单链接或者ID" />
            <a-alert class="alert" message="输入的链接或者ID不正确" type="error" closable v-if="isValueError" />
            <div class="btn">
                <div>
                    <a-button type="primary" @click="handleValue"> 获取歌曲 </a-button>
                    <a-select ref="select" v-model:value="quality" style="width: 120px; margin-left: 12px">
                        <a-select-option value="standard">标准</a-select-option>
                        <a-select-option value="exhigh">极高</a-select-option>
                        <a-select-option value="lossless">无损</a-select-option>
                        <a-select-option value="hires">Hi-Res</a-select-option>
                        <a-select-option value="jyeffect">高清环绕声</a-select-option>
                        <a-select-option value="sky">沉积环绕声</a-select-option>
                        <a-select-option value="jymaster">超清母带</a-select-option>
                    </a-select>
                </div>
                <a-button class="downloadBtn" type="primary" @click="downloadSong" v-if="song"> 下载 </a-button>
            </div>
        </a-card>
        <a-card class="player" v-if="song">
            <div class="playerBox">
                <img :src="song.pic" alt="song" />
                <div class="control">
                    <div class="controlBox">
                        <div class="play">
                            <Icon class="icon" icon="gravity-ui:triangle-left-fill" @click="seek(-5)" />
                            <Icon class="icon con" icon="gravity-ui:pause-fill" @click="playStop" v-if="isPlay" />
                            <Icon class="icon con" icon="gravity-ui:play-fill" @click="playStop" v-else />
                            <Icon class="icon" icon="gravity-ui:triangle-right-fill" @click="seek(5)" />
                        </div>
                        <div class="info">
                            <p class="title">{{ song.name }}</p>
                            <p>{{ song.ar_name }}</p>
                        </div>
                    </div>
                    <mdui-linear-progress :value="currentTime" :max="duration"></mdui-linear-progress>
                </div>
            </div>
        </a-card>
        <div class="bg" v-if="song">
            <img :src="song.pic" alt="bg" />
        </div>
    </a-config-provider>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { downloadStore } from "../stores/download";
import { message } from "ant-design-vue";
import { Icon } from "@iconify/vue";
import "mdui/components/linear-progress.js";
import { setColorScheme } from "mdui/functions/setColorScheme.js";
setColorScheme("#EC4141");

const download = downloadStore();
// const value = ref("");
const value = ref("https://music.163.com/song?id=1830190033&userid=480428722");
const quality = ref("standard");
const isValueError = ref(false);
const song = ref(null);
const isPlay = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const lyric = ref("");
const tlyric = ref("");
const keySong = "song";

const audio = new Audio();

const initializeSong = () => {
    audio.src = song.value.url;

    audio.addEventListener("loadedmetadata", () => {
        duration.value = audio.duration;
    });

    audio.addEventListener("timeupdate", () => {
        currentTime.value = audio.currentTime;
    });
};

const handleValue = async () => {
    const urlRegex = /https?:\/\/[^\s]+/;
    const idRegex = /^\d+$/;

    if (value.value.match(urlRegex)) {
        const urlParams = new URL(value.value).searchParams;
        const id = urlParams.get("id");
        song.value = await download.getSongInfo(quality.value, id);
        initializeSong();
        initLyrics(song.value.lyric, song.value.tlyric);
        return;
    }
    if (value.value.match(idRegex)) {
        song.value = await download.getSongInfo(quality.value, value.value);
        initializeSong();
        initLyrics(song.value.lyric, song.value.tlyric);
        return;
    }
    isValueError.value = true;
};

const downloadSong = async () => {
    message.loading({ content: "下载歌曲中... ", key: keySong });
    try {
        download.downloadSong(song.value, () => {
            message.success({ content: "下载歌曲成功", key: keySong });
        });
    } catch (error) {
        message.error({ content: "下载歌曲失败 " + error, key: keySong });
    }
};

const playStop = () => {
    if (isPlay.value) {
        audio.pause();
        isPlay.value = false;
    } else {
        audio.play();
        isPlay.value = true;
    }
};

const seek = (seconds) => {
    const newTime = audio.currentTime + seconds;
    audio.currentTime = Math.max(0, Math.min(newTime, duration.value)); // 避免超出范围
};

const updateProgress = () => {
    audio.currentTime = currentTime.value;
};
</script>

<style lang="scss" scoped>
.control {
    width: 700px;
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
    .btn {
        display: flex;
        justify-content: space-between;
    }
}

.player {
    width: 700px;
    position: fixed;
    bottom: 12px;

    .playerBox {
        display: flex;
        img {
            width: 64px;
            height: 64px;
        }
        .control {
            width: 100%;
            margin-left: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .controlBox {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .play {
                    height: 24px;
                    display: flex;
                    align-items: center;

                    .icon {
                        margin: 0 12px;
                        font-size: 1.4rem;
                        cursor: pointer;
                    }
                    .con {
                        font-size: 1.6rem;
                    }
                }
                .info {
                    flex-grow: 1;
                    margin-left: 24px;

                    .title {
                        font-size: 1.1rem;
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
.bg {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.8);
    img {
        width: 120%;
        height: 120%;
        filter: blur(100px) contrast(1.2) brightness(0.8);
    }
}

@media screen and (max-width: 768px) {
    .control {
        width: 90vw;
        margin-top: 25vh;

        .btn {
            flex-direction: column;

            >div {
                display: flex;
                justify-content: space-between;
            }
            .downloadBtn {
                margin-top: 12px;
            }
        }
    }
    .player {
        width: 90vw;

        img {
            width: 82px;
            height: 82px;
        }
        .playerBox {
            flex-direction: column;
            align-items: center;
            width: 100%;

            .control {
                margin: 0;

                .controlBox {
                    flex-direction: column;
                    .play {
                        margin-bottom: 12px;
                    }
                    .info {
                        order: -1;
                        margin: 0;
                        margin: 12px 0;
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>
