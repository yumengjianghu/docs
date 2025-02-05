<template>
    <div class="copy-block">
        <!-- 复制按钮 -->
        <button class="copy-button" @click="copyText" ref="PromptText">CopyBlock</button>
        <!-- 文字内容 -->
        <div class="content" ref="content">
            {{ prompt }}
            {{ CodedText }}

        </div>
    </div>
    <GlobalToast ref="toast" :duration="500" />
</template>

<script>
import { ref ,onMounted} from "vue";

export default {
    name: "CopyBlock",
    props: {
        text: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        DisplayStatus: {
            type: String,
            required: false,
            default: 'true'
        },
        size: {
            type: String,
            required: false,
            default: 15
        },
    },
    setup(props) {
        let PromptText=ref(null)
        let content=ref(null)
        let CodedText = true;
        onMounted(()=>{
            content.value.style.fontSize=props.size+'px'
        })
        if (props.DisplayStatus == "true") {
            CodedText = props.text.replace(/./g, "◼");
        }
        else CodedText = props.text
        // 复制文字内容
        const copyText = () => {
            navigator.clipboard
                .writeText(props.text)
                .then(() => {
                    // showToast('复制成功', 'true')
                    PromptText.value.innerHTML='Success'
                })
                .catch(() => {
                    // showToast('复制失败', 'false')
                    PromptText.value.innerHTML='Error'
                    //  shareBtn.value.innerHTML = '分享'
                });
                setTimeout(() => {
                    PromptText.value.innerHTML='CopyBlock'
                }, 1000);
        };
        const toast = ref(null);
        const showToast = (message, status) => {
            toast.value.show(message, status); // 调用子组件的 show 方法
        };
        return {
            copyText,
            showToast,
            CodedText,
            toast,
            PromptText,
            content
        };
    },
};
</script>

<style scoped>
.copy-block {
    position: relative;
    padding: 16px;
    border: 1px solid var(--vp-c-bg-alt);
    border-radius: 4px;
    background-color: var(--vp-c-bg-alt);
    font-family: Arial, sans-serif;
    margin-top: 20px;
}

.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 8px;
    /* background-color: #007bff; */
    border: 1px var(--vp-c-bg) solid;
    color: #ccc;
    /* border: none; */
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background 0.2s ease;
}

.copy-button:hover {
    background-color: var(--vp-c-bg);
}

.content {
    margin-top: 8px;
    white-space: pre-wrap;
    /* 保留换行和空格 */
    font-weight: bold;
    /* font-size: 20px; */
}
</style>