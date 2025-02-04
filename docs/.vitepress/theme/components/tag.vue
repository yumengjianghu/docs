<template>
    <button class="Rbtn" ref="Rbtn" @click="go()">{{ name }}
        <div class="count">{{ count }}</div>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
let { name, color, count, src } = defineProps(['name', 'color', 'count', 'src'])
let Rbtn = ref(null)
onMounted(() => {
    Rbtn.value.style.background = color
})
function go() {
    let port = window.location.port ? ':' + window.location.port + '/' : null
    // port=null // 测试 生成环境 / 开发环境
    let url = port ? 'http://'+window.location.hostname + port + src : 'https://'+window.location.hostname + '/' + src
    if (src) {
        window.location.href = url
    }
}
</script>

<style scoped>
.Rbtn {
    position: relative;
    height: 3em;
    width: 8em;
    border: none;
    border-radius: 10em;
    background: #016DD9;
    font-size: 17px;
    color: #ffffff;
    font-family: inherit;
    font-weight: 900;
    margin: 10px;
}

.Rbtn:hover {
    animation: shake3856 0.3s linear infinite both;
}

.count {
    position: absolute;
    top: 12px;
    right: 90px;
    font-weight: 500;
    border: 1px solid rgb(255, 255, 255);
    padding: 0px 9px;
    border-radius: 50%;
}

@keyframes shake3856 {
    0% {
        -webkit-transform: translate(0);
        transform: translate(0);
    }

    20% {
        -webkit-transform: translate(-2px, 2px);
        transform: translate(-2px, 2px);
    }

    40% {
        -webkit-transform: translate(-2px, -2px);
        transform: translate(-2px, -2px);
    }

    60% {
        -webkit-transform: translate(2px, 2px);
        transform: translate(2px, 2px);
    }

    80% {
        -webkit-transform: translate(2px, -2px);
        transform: translate(2px, -2px);
    }

    100% {
        -webkit-transform: translate(0);
        transform: translate(0);
    }
}
</style>