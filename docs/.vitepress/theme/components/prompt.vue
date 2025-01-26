<template>
    <GlobalToast :duration="3000" ref="toast" />
</template>

<script setup>
import { ref,onMounted } from 'vue';
const toast = ref(null);
const showToast = (message, status, slotStatus, durationStatus) => {
    toast.value.show(message, status, slotStatus, durationStatus); // 调用子组件的 show 方法
};
onMounted(()=>{
    showToast("欢迎来到菜鸟技术栈")
})
</script>

<style lang="scss" scoped></style>