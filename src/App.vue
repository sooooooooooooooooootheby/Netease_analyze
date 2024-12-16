<template>
    <header>
        <a-button class="button" @click="router.push({ name: 'list' })">歌单模式</a-button>
        <a-button class="button" @click="router.push({ name: 'single' })">单曲模式</a-button>
        <a-button @click="router.push({ name: 'about' })"> 已解析歌曲{{ count }} </a-button>
    </header>
    <div class="main">
        <router-view></router-view>
    </div>
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
