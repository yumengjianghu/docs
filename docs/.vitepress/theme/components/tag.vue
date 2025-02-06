<template>
    <button class="Rbtn" ref="Rbtn" @click="go()">{{ name }}
        <!-- <div class="count" ref="Rcount">{{ count }}</div> -->
        <div class="point">
            <!-- <div class="leftpoint"></div> -->
            <!-- <div class="rightpoint"></div> -->
        </div>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress'

const router = useRouter()

const navigate = (src) => {
    router.go(src)
}
let { name, color, count, src } = defineProps(['name', 'color', 'count', 'src'])
let Rbtn = ref(null)
let Rcount = ref(null)
onMounted(() => {
    Rbtn.value.style.borderColor = color
    if (name == 'Back') {
        Rcount.value.style.border = "none";
    }
})
function go() {
    // let port = window.location.port ? ':' + window.location.port + '/' : null
    // // port=null // 测试 生成环境 / 开发环境
    // let url = port ? 'http://' + window.location.hostname + port + src : 'https://' + window.location.hostname + '/' + src
    if (src) {
        // window.location.href = url
        navigate(src)
    }
}
</script>

<style scoped>
.Rbtn {
    position: relative;
    justify-content: space-between;
    height: 3em;
    line-height: 3em;
    width: 8em;
    border: none;
    /* border-radius: 50%; */
    border-top-left-radius: 0%;
    border-bottom-left-radius: 20%;
    border-top-right-radius: 20%;
    border-bottom-right-radius: 0%;
    border: 2px solid #31572c;

    font-size: 17px;
    color: var(--vp-c-text-1);
    font-family: inherit;
    font-weight: 900;
    margin: 10px;
    /* transition: all 0.3s; */
    box-shadow: 6px 6px 1px 0px var(--item-shadow-color);
    /* transition: all 0.4s; */
}

.Rbtn:hover {
    box-shadow: 8px 8px 1px 0px var(--item-shadow-color);
    top: -1px;
    left: -1px;

    /* background-color: #51572c; */
    /* height: 3em; */
    /* width: 9em; */
    /* height: 60px; */
    /* line-height: 60px; */
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
.point{
    display: flex;
    justify-content: space-between;
    position: relative;
    top: -41px;
    padding: 10px;
}
.leftpoint {
    height: 10px;
    width: 10px;
    background-color: var(--vp-c-text-1);
    /* border: 1px solid #90a955; */
    border-radius: 10px;
    
}

.rightpoint {
    height: 10px;
    width: 10px;
    background-color: var(--vp-c-text-1);
    /* border: 1px solid #90a955; */
    border-radius: 10px;

}

</style>