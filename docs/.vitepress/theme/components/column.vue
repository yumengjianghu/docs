<template>
    <div class="item" ref="item">
        <div class="title" @click="Jump()"><span>{{ title }}</span> <span class="status">{{ status }}</span></div>
        <hr>
        <div class="overview">{{ overview }}</div>
        <div class="share" @click="showBox()">分享
            <div class="shareBox" :class="{ shareBoxShow: isShow }">{{ URL }}
                <div class="copy" :class="{ copyShow: isCopy }">复制成功</div>
            </div>
        </div>
        <div class="time">{{ recordTime }}</div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
const item = ref(null);
let isShow = ref(false)
let isCopy = ref(false)
let port = window.location.port ? ':' + window.location.port + '/' : null
// port=null // 测试 生成环境 / 开发环境
let URL = port ? window.location.hostname + port + src : window.location.hostname + '/' + src
let { title,
    overview,
    RecordTime, src,
    status, delay } = defineProps(['title', 'overview', 'RecordTime', 'status', 'src', 'delay'])
let recordTime = RecordTime ? RecordTime : getFormattedDate()
function showBox() {
    isShow.value = true
    setTimeout(() => {
        isCopy.value = true
    }, 500)
    setTimeout(() => {
        isCopy.value = false
        setTimeout(() => {
            isShow.value = false
        }, 500);
    }, 2000);
    copyText(URL)
}

const copyText = (text) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            console.log("复制成功")
        })
        .catch(() => {
            console.log("复制失败");

        });
};
function Jump() {
    if (src) {
        window.location.href = src
    }
}
function getFormattedDate() {
    const date = new Date();

    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接成 "YYYY-MM-DD HH：mm：ss" 格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 动态添加元素缓动效果时间
onMounted(() => {
    if (item.value) {
        const index = delay ? delay : '1'
        item.value.style.setProperty('--delay', index); // 设置变量值
        item.value.style.animationDelay = `calc(var(--delay) * 0.2s)`; // 追加样式
    }
});
</script>

<style scoped>
.item {
    border: 1px solid var(--item-border-color);
    border-radius: 2px;
    padding: 30px;
    position: relative;
    margin-top: 50px;
    box-shadow: 10px 10px 1px 0px var(--item-shadow-color);
    opacity: 0;
    animation: slideDown 0.5s ease-out forwards;
}
.item:hover{
    border-left-color: var(--item-border-color);
    box-shadow: 20px 20px 1px 0px var(--item-shadow-color);
    top: -5px;
    left: -5px;
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.title {
    font-size: 25px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}

.status {
    font-size: 15px;
    font-weight: bold;
}

.share {
    position: absolute;
    bottom: 0;
    right: 15px;
    padding: 15px;
    cursor: pointer;
    z-index: 999;
    color: #7a7a7a;
}

.shareBox {
    color: black;
    position: absolute;
    bottom: 0px;
    right: -16px;
    border: 1px solid rgb(221, 221, 221);
    background-color: #edf2fa;
    padding: 5px;
    font-size: 13px;
    opacity: 0;
    transition: all 0.5s ease;
    white-space: nowrap;
}

.shareBoxShow {
    bottom: -36px;
    opacity: 1;

}

.copy {
    position: absolute;
    bottom: -1px;
    right: 0;
    border: 1px solid rgb(221, 221, 221);
    background-color: #0e943a;
    color: white;
    transition: all 0.5s ease;
    opacity: 0;
    z-index: -1;
    padding: 5px;
}

.copyShow {
    right: -65px;
    opacity: 1;
}

.time {
    position: absolute;
    bottom: 14px;
    color: #bfbfb9;
    /* font-weight: bold; */
}

.overview {
    /* border: 1px solid red; */
    margin-bottom: 20px;
    color: #727171;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
    width: 20vw;
    /* 必须设置宽度（或 max-width） */
}

@media (max-width:800px) {
    .copyShow {
        right: 0;
        bottom: -37px;
    }
}
</style>