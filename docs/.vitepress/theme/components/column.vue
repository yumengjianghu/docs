<template>
    <div class="item" ref="item">
        <div class="title" @click="navigate(src)"><span>{{ title }}</span> <span class="status">{{ status }}</span></div>
        <hr>
        <div class="overview">{{ overview }}</div>
        <div class="share" ref="shareBtn" @click="showBox()">分享
        </div>
        <div class="time">{{ recordTime }}</div>
        <div class="slot" ref="Tagm">
            <!-- <slot></slot> -->
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vitepress'

const router = useRouter() 

const navigate = (src) => {
  router.go(src) 
}

const item = ref(null);
let shareBtn = ref(null);
let Tagm = ref(null)
// let port = window.location.port ? ':' + window.location.port + '/' : null
// // port=null // 测试 生成环境 / 开发环境
// let URL = port ? window.location.hostname + port + src : window.location.hostname + '/' + src
let { title,
    overview,
    RecordTime, src,
    status, delay, TagColor } = defineProps(['title', 'overview', 'RecordTime', 'status', 'src', 'delay', 'TagColor'])
let recordTime = RecordTime ? RecordTime : getFormattedDate()
function showBox() {
    shareBtn.value.innerHTML = copyText(URL)
    setTimeout(() => {
        shareBtn.value.innerHTML = '分享'
    }, 1000)
}

const copyText = (text) => {
    try {
        navigator.clipboard
        .writeText(text)
        .then(() => {
            console.log("复制成功")
        })
        .catch(() => {
            console.log("复制失败");
        });
    } catch (error) {
        return '复制失败'
    }
    return '复制链接成功!';
};
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
    if (TagColor) {
        Tagm.value.style.background = TagColor;
    }
});
</script>

<style scoped>
.slot {
    height: 10px;
    width: 10px;
    background-color: aqua;
    /* border: 3px solid aqua; */
    position: absolute;
    top: 10px;
    left: 10px;
    /* background-color: var(--vp-c-bg); */
    filter: blur(1px);
    border-radius: 50%;
    transition: all 0.5s ease;
}

.item {
    overflow: hidden;
    border: 1px solid var(--item-border-color);
    border-radius: 2px;
    padding: 30px;
    position: relative;
    margin-top: 50px;
    box-shadow: 10px 10px 1px 0px var(--item-shadow-color);
    opacity: 0;
    animation: slideDown 0.5s ease-out forwards;
    background-color: var(--column-background-color);
}

.item:hover {
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