<template>
    <div>
        <!-- <appHeader /> -->
        <NuxtPage />
        <notification />
        <div class="btn fixed bottom-4 right-5" @click="navigateTo('https://github.com/sooooooooooooooooootheby/Netease_analyze', { open: { target: '_blank' } })">
            <Icon name="akar-icons:github-fill" />
            {{ count }}
        </div>
    </div>
</template>

<script lang='ts' setup>
const count = ref<number>(0);

onMounted(async () => {
    count.value = await $fetch("https://api.s22y.moe/count/get?name=neteasy&type=number");
})
</script>

<style lang='scss' scoped>

</style>