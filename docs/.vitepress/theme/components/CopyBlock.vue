<template>
    <div class="copy-block">
        <!-- 复制按钮 -->
        <button class="copy-button" @click="copyText">复制</button>
        <!-- 文字内容 -->
        <div class="content">
            {{ prompt }}
            {{ CodedText }}

        </div>
    </div>
    <GlobalToast ref="toast" :duration="500" />
</template>

<script>
import { ref } from "vue";

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
    },
    setup(props) {

        let CodedText = true;
        if (props.DisplayStatus == "true") {
            CodedText = props.text.replace(/./g, "◼");
        }
        else CodedText = props.text
        // 复制文字内容
        const copyText = () => {
            navigator.clipboard
                .writeText(props.text)
                .then(() => {
                    showToast('复制成功', 'true')
                })
                .catch(() => {
                    showToast('复制失败', 'false')
                });
        };
        const toast = ref(null);
        const showToast = (message, status) => {
            toast.value.show(message, status); // 调用子组件的 show 方法
        };
        return {
            copyText,
            showToast,
            CodedText,
            toast
        };
    },
};
</script>

<style scoped>
.copy-block {
    position: relative;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f6f6f7;
    font-family: Arial, sans-serif;
}

.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 8px;
    /* background-color: #007bff; */
    border: 1px #e2e2e3 solid;
    color: #000000;
    /* border: none; */
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background 0.2s ease;
}

.copy-button:hover {
    background-color: #ffffff;
}

.content {
    margin-top: 8px;
    white-space: pre-wrap;
    /* 保留换行和空格 */
    font-weight: bold;
}
</style>