<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="left">
                    <Icon class="icon" icon="simple-icons:neteasecloudmusic" />
                    <span class="title"> 网易云无损解析 </span>
                </div>
                <div class="right">
                    <span>目前已解析 {{ count }} 次</span>
                </div>
            </el-header>
            <el-main>
                <div class="bar">
                    <el-radio-group v-model="page" fill="#E60026">
                        <el-radio-button label="歌单模式" value="songList" />
                        <el-radio-button label="单曲模式" value="single" />
                        <el-radio-button label="关于" value="about" />
                    </el-radio-group>
                    <a href="https://github.com/sooooooooooooooooootheby/Netease_analyze" target="_blank">
                        <el-button type="primary" color="#E60026" plain>Github</el-button>
                    </a>
                </div>
                <songList v-if="page === 'songList'" />
                <single v-if="page === 'single'" />
                <about v-if="page === 'about'" />
            </el-main>
        </el-container>
        <el-dialog v-model="centerDialogVisible" title="Hello" width="500" align-center style="padding: 20px 40px">
            <span
                >当前项目处于测试阶段, 如果你发现了bug或者一些需要改进的地方欢迎提<a
                    href="https://github.com/sooooooooooooooooootheby/Netease_analyze/issues/new"
                    target="_blank"
                    >issues</a
                >, 或者发送邮件到sooooooooooooooooootheby@gmail.com, 以帮助我更好地改进解析站点.</span
            >
            <br />
            <br />
            <ul>
                <span>TODO:</span>
                <li><del>无法正确识别提取url和id</del></li>
                <li><del>当音乐过多时打包下载导致的内存爆炸</del></li>
                <li>概率出现CORS问题(出现概率不是很大 刷新几次就能解决 我懒得修了 也不好修 等严重的时候再说罢)</li>
                <li>加入酷狗解析(计划一月底开始做)</li>
            </ul>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="centerDialogVisible = false"> ok </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import songList from "@/components/songList.vue";
import single from "@/components/single.vue";
import about from "@/components/about.vue";
import axios from "axios";

const page = ref("songList");
const centerDialogVisible = ref(true);

const count = ref(0);
axios.get("https://api.sooooooooooooooooootheby.top/Netease_url/get_count").then((res) => {
    count.value = res.data.count;
});
</script>

<style lang="scss" scoped>
@import "style/handle.scss";

.el-header {
    height: 64px;
    padding: 0 64px;
    border-bottom: 2px dashed var(--el-border-color);
    display: flex;
    justify-content: space-between;

    .left {
        height: 100%;
        @include flex-center($direction: row, $content: start);

        .icon {
            font-size: 2rem;
            color: $neteaseColor;
        }
        .title {
            margin-left: 14px;
            font-size: 1.1rem;
            font-weight: bold;
        }
    }
    .right {
        height: 100%;
        @include flex-center($direction: row, $content: start);

        span {
            font-weight: bold;
        }
    }
}
.el-main {
    height: calc(100vh - 64px);
    .bar {
        display: flex;
        .el-button {
            margin-left: 12px;
        }
    }
}

@media (max-width: 900px) {
    .el-header {
        padding: 0 20px;
    }
}
</style>
