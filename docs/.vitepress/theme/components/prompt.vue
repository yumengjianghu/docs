<template>
    <GlobalToast :duration="1000" ref="toast" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
const toast = ref(null);
const showToast = (message, status, slotStatus, durationStatus) => {
    toast.value.show(message, status, slotStatus, durationStatus); // 调用子组件的 show 方法
};
if (localStorage.getItem('FirstVisit') == null) {
    onMounted(() => {
        showToast("欢迎来到菜鸟技术栈，希望你能找到你需要的东西😋")
        localStorage.setItem('FirstVisit', true);
        setTimeout(() => {
            showToast("部分文档尝试使用网络懒加载⚡")
        }, 1500);
    })
}
else {
    onMounted(() => {
        showToast("欢迎回来🌈",'true')
    })
}

</script>
<style scoped></style>