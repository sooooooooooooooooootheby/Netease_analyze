<template>
    <button @click="logCookie">获取cookie</button>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
console.log(config.cookie);
</script>
