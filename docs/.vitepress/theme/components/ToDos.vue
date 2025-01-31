<template>
    <div class="custom-checkbox">
        <input class="custom-checkbox-input" type="checkbox" :id="'task' + title" @change="toggleTask(this)" v-model="checked" />
        <label class="custom-checkbox-label" ref="text" :for="'task' + title">{{ title ? title : "默认值" }}</label>
    </div>
    <br>
</template>

<script setup>
import { ref, defineProps,onMounted } from 'vue';
let checked = ref()
const { title } = defineProps(['title'])
let text=ref()
const savedTasks = localStorage.getItem('task' + title, checked.value);
if (savedTasks) {
    checked.value = savedTasks
}
function toggleTask() {
    localStorage.setItem('task' + title, checked.value);
}
</script>
<style>
.todo-item {
    margin-bottom: 10px;
}

.todo-item label {
    margin-left: 10px;
}
.custom-checkbox {
  margin-top: 20px;
  position: relative;
  display: inline-block;
}

.custom-checkbox-input {
  opacity: 0; /* 隐藏原生复选框 */
  position: absolute;
}

.custom-checkbox-label {
  padding-left: 40px; /* 为自定义样式留出空间 */
  padding-top: 7px;
  position: relative;
  cursor: pointer;
}
.custom-checkbox-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border: 2px solid red;
  border-radius: 4px;
  border-radius: 50%;

  background-color: transparent;
  transition: all 0.3s ease;
}

.custom-checkbox-label::after {
  content: '❌';
  position: absolute;
  left: 5.5px;
  top: 4px;
  width: 8px;
  height: 8px;
  background-color: transparent;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.custom-checkbox-input:checked + .custom-checkbox-label::before {
  border-color: #05a134;
  background-color: transparent;
  
}

.custom-checkbox-input:checked + .custom-checkbox-label::after {
  content: "✔";
}
</style>