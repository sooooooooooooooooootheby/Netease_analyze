<template>
    <a-config-provider
        :theme="{
            token: {
                colorPrimary: '#EC4141',
            },
        }"
    >
        <header>
            <a-button class="button" @click="router.push({ name: 'list' })">歌单模式</a-button>
            <a-button class="button" @click="router.push({ name: 'single' })">单曲模式</a-button>
            <a-button @click="router.push({ name: 'about' })"> 已解析歌曲{{ count }} </a-button>
        </header>
        <div class="main">
            <router-view></router-view>
        </div>
        <a-modal v-model:open="open" title="Hi" @ok="open = false">
            <p>本项目目前并不算太稳定, 如果碰到bug或者你有认为需要改进的地方, 还请麻烦你提交<a href="https://github.com/sooooooooooooooooootheby/Netease_analyze/issues/new">issues</a>或者通过邮箱联系我</p>
            <br>
            <p>邮箱: sooooooooooooooooootheby@gmail.com</p>
            <br>
            <p>TODO:</p>
            <ul>
                <li>优化下载反馈</li>
                <li>添加酷狗解析</li>
            </ul>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { message } from "ant-design-vue";
import { theme } from "ant-design-vue";

const router = useRouter();
const page = ref(true);
const count = ref(0);
axios.get("https://api.sooooooooooooooooootheby.top/Netease_url/get_count").then((res) => {
    count.value = res.data.count;
});
const open = ref(true);
</script>

<style lang="scss" scoped>
header {
    position: fixed;
    top: 24px;
    right: 24px;

    .button {
        margin-right: 12px;
    }
}
</style>
