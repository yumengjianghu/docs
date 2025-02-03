<template>
    <div ref="target">
        <p v-if="isVisible">
            <slot>默认值</slot>
        </p>
        <p v-else>
            <slot>默认值</slot>
        </p>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

export default {
    setup() {
        const target = ref(null);
        const isVisible = ref(false);
        // 调用 stop 函数可以停止观察器，释放资源。
        const { stop } = useIntersectionObserver(target, ([entry], observerElement) => {
            if (entry.isIntersecting) {
                isVisible.value = true;
                // console.log('组件已进入可视区域');
            } else {
                isVisible.value = false;
                // console.log('组件已离开可视区域');   
            }
        }, {
            // 可选的观察器配置
            root: null, // 默认为视口
            rootMargin: '10px',  // 类似于 CSS 的 margin，用于扩大或缩小视口的边界。
            threshold: [0, 1] // 在完全可见和完全不可见时触发
        });

        return {
            target,
            isVisible
        };
    }
};
</script>