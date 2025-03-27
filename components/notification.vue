<template>
    <dialog ref="msg" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">Hello!</h3>
            <p class="mt-4">欢迎使用这个网易云解析工具!</p>
            <p>当你使用歌单模式批量下载时务必同意多个下载请求</p>
            <img src="/1.webp" alt="1" />
            <label class="fieldset-label mt-4">
                <input type="checkbox" checked="checked" class="checkbox checkbox-sm" v-model="isShow" />
                不再提示
            </label>
        </div>
    </dialog>
</template>

<script lang="ts" setup>
const msg = ref(null);
const isShow = ref(false);

watch(isShow, (newValue: boolean) => {
    localStorage.setItem("isShow", String(newValue));
});

onMounted(() => {
    isShow.value = JSON.parse(localStorage.getItem("isShow") || "false");

    if (!isShow.value) {
        msg.value.showModal();
    }
});
</script>
