<template>
    <div v-if="isVisible" class="toast-container">
        <div class="toast-message" :class="{ GreenBgColor: GColorstatus, OrangeBgColor: RColorstatus }">
            <span class="text">{{ message }}</span>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";

export default {
    name: "GlobalToast",
    props: {
        message: {
            type: String,
            default: "",
        },
        duration: {
            type: Number,
            default: 3000, // 默认显示 3 秒
        },
        status: {
            type: String,
            default: "true",

        }
    },
    setup(props) {
        const isVisible = ref(false);
        const internalMessage = ref(props.message); // 内部维护的消息内容

        let GColorstatus = ref(true) // 提示框颜色
        let RColorstatus = ref(false)

        // 显示提示
        const show = (newMessage, status) => {
            internalMessage.value = newMessage; // 更新消息内容
            isVisible.value = true;
            if (status == "false") GColorstatus.value = false
            else if (status == "warn") RColorstatus.value = true

            setTimeout(() => {
                isVisible.value = false;
            }, props.duration);
        };

        // 监听 message 变化，自动显示提示
        watch(
            () => props.message,
            (newMessage) => {
                if (newMessage) {
                    show(newMessage);
                }
            }
        );

        // 暴露 show 方法，供父组件调用
        return {
            isVisible,
            GColorstatus,
            RColorstatus,
            message: internalMessage,
            show,
        };
    },
};
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    min-width: 300px;
}

.toast-message {
    padding: 12px 24px;
    color: #000000;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    animation: slideDown 0.3s ease-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: right;
    flex-wrap: wrap;
    background: aliceblue url('/docs/status/error.png') no-repeat 10px center;
    
}

.toast-message .text {
    vertical-align: baseline;
    margin-left: 30px;
}

.GreenBgColor {
  
    background: aliceblue url('/docs/status/right.png') no-repeat 10px center;

}

.OrangeBgColor {
    background: aliceblue url('/docs/status/warn.png') no-repeat 10px center;

}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>