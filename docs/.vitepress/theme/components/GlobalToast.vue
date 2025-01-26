<template>
    <div v-if="isVisible" class="toast-container" :class="{ hiddenUp: ishidden }">
        <div class="toast-message"
            :class="{ GreenBgColor: GColorstatus, OrangeBgColor: RColorstatus, WelcomeToHome: isHome }">
            <span class="text">
                {{ message }}
                <br>
                <slot v-if="slotS"></slot>
            </span>
        </div>
    </div>
</template>

<script>
import { ref, watch } from "vue";

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

        let GColorstatus = ref(true) // 提示图标
        let RColorstatus = ref(false)
        let isHome = ref(false)
        const ishidden = ref(false)

        let slotS = ref(false) // 插槽状态

        // 显示提示
        const show = (newMessage, status, slotStatus, durationStatus) => {
            slotS.value = slotStatus ? slotStatus : false // 默认值
            if (isVisible.value == false) {
                internalMessage.value = newMessage; // 更新消息内容
                isVisible.value = true;
                if (status == "false") {
                    GColorstatus.value = false
                    RColorstatus.value = false
                }
                else if (status == "warn") {
                    RColorstatus.value = true
                    GColorstatus.value = false
                }
                else if (status == "true") {
                    RColorstatus.value = false
                    GColorstatus.value = true
                }
                else {
                    RColorstatus.value = false
                    GColorstatus.value = false
                    isHome.value = true
                }
                durationStatus = durationStatus ? durationStatus : false // 默认值

                if (durationStatus != true) {
                    setTimeout(() => {
                        ishidden.value = true
                        setTimeout(() => {
                            isVisible.value = false;
                        }, props.duration / 4);


                    }, props.duration);
                }
                ishidden.value = false

            }
        };
        const stopShow = () => {
            ishidden.value = true
            setTimeout(() => {
                isVisible.value = false;
            }, props.duration / 4);
        }
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
            ishidden,
            isHome,
            message: internalMessage,
            show,
            stopShow,
            slotS
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
    min-width: 15%;
    transition: all 0.3s ease;
}

.toast-message {
    padding: 12px 24px;
    color: #000000;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    animation: slideDown 0.3s forwards;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: right;
    flex-wrap: wrap;
    background: aliceblue url('/docs/status/error.svg') no-repeat 10px center;
    transition: all 1s ease;
}

.toast-message .text {
    vertical-align: baseline;
    margin-left: 30px;
}

.GreenBgColor {

    background: aliceblue url('/docs/status/right.svg') no-repeat 10px center;

}

.OrangeBgColor {
    background: aliceblue url('/docs/status/warn.svg') no-repeat 10px center;

}

.WelcomeToHome {
    /* background: aliceblue url('/docs/status/backHome.png') no-repeat 10px center,
        url('/docs/status/backHomeRight.png') no-repeat 10px right
        ; */
    /* background: aliceblue url('/docs/status/backHomeRight.png') no-repeat 10px center; */

    background-image: url('/docs/status/backHomeLeft.svg'), url('/docs/status/backHomeRight.svg');
    background-position: 10px, 920px;
    background-repeat: no-repeat, no-repeat;
    background-size: contain contain;
    font-size: 25px;
    /* font-weight: 600; */
    width: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 10px;
    color: #247ef8
}

@media (max-width:1800px) {
    .WelcomeToHome {
        background-position: 1px 1px, 60px;
        width: auto;
        color: transparent;

    }

}

@media (min-width:1800px) {
    .toast-message {
        /* color: #000000 */
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
        /* opacity: 0;
        transform: translateY(-20px); */
    }
}

.hiddenUp {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
    /* transform: translateX(50px); */

}
</style>