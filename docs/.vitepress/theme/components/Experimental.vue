<template>
    <!-- ----------------------------------------------------------------------------- -->
    <h2>弹窗测试</h2>
    <GlobalToast :duration="GlobalToastDurationTime" ref="toast">
        <div class="slotContent">
            <input type="text" class="textInput" v-model="testValue"><button class="textInputBtn"
                @click="submit()">提交</button>
        </div>
    </GlobalToast>
    <div class="testBlock">
        <button @click="showToast(`通过提示，提示时间:${GlobalToastDurationTime / 1000}秒`, 'true')">模拟通过提示</button>
        <button @click="showToast('警告提示', 'warn')">模拟警告提示</button>
        <button @click="showToast('错误提示', 'false')">模拟报错提示</button>
        <button @click="UpdateData()">修改弹窗持续时间</button>

    </div>
    <!-- ----------------------------------------------------------------------------- -->
    
</template>

<script setup>
// --------------------------------------------------------------------------------------------
import { ref, onMounted, onUnmounted } from "vue";
// 弹窗组件配置
const toast = ref(null);
const GlobalToastDurationTime = ref(1000) // 弹窗组件持续时间
let testValue = ref() // ...
const showToast = (message, status, slotStatus, durationStatus) => {
    toast.value.show(message, status, slotStatus, durationStatus); // 调用子组件的 show 方法
};
function submit() {
    toast.value.stopShow()
    const newData = Number(testValue.value)
    setTimeout(() => {
        if (newData) {
            GlobalToastDurationTime.value = newData
            setTimeout(() => {
                showToast(`更改成功,新值:${newData / 1000}秒`, 'true')
            }, 500);
        }
        else {
            setTimeout(() => {
                showToast('更改失败', 'false')
            }, 500);
        }
    }, 100);

}
function UpdateData() {
    showToast(`当前弹窗持续时间:${GlobalToastDurationTime.value / 1000}秒，请输入修改的值`, 'warn', true, true)
}
// --------------------------------------------------------------------------------------------

</script>

<style scoped>
/* -------------------------------------------------------------------------------------------------------- */
.testBlock {
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
    background-color: #f6f6f7;
    padding: 50px;
}

button {
    /* background: #6e6e6e; */
    border: 1px solid #ddd;
    color: #fff;
    color: #000000;
    font-weight: bold;
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s ease;
    height: 100%;
}

button:hover {
    background-color: #ffffff;
}

.textInput {
    border: 1px #e0e1e2 solid;
    border-radius: 5px;
    padding-left: 5px;
    flex-grow: 1;
}

.slotContent {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

}

@media (max-width:648px) {
    .textInputBtn {
        width: 100%;
        /* height: 30px; */
        margin-top: 5px;
    }
}

/* -------------------------------------------------------------------------------------------------------- */
</style>
