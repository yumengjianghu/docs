<template>
  <div class="typewriter-container">
    <div class="typewriter-content">
      <span class="typewriter-text">{{ displayText }}</span><!--
      --><span class="cursor" :class="{ 'hide-cursor': isFinished }"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true,
    default: () => []
  },
  typeSpeed: {
    type: Number,
    default: 100
  },
  deleteSpeed: {
    type: Number,
    default: 50
  },
  delayBetween: {   
    type: Number,
    default: 1500
  }
})

const displayText = ref('')
const isFinished = ref(false)
let currentIndex = 0
let isDeleting = false

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const typeText = async () => {
  const currentText = props.texts[currentIndex]
  
  if (isDeleting) {
    // 删除效果
    displayText.value = currentText.substring(0, displayText.value.length - 1)
    await sleep(props.deleteSpeed)
    
    if (displayText.value === '') {
      isDeleting = false
      if (currentIndex === props.texts.length - 1) {
        // 如果是最后一个文本，开始打第一个文本
        currentIndex = 0
        // 开始打第一个文本，之后不再循环
        const firstText = props.texts[0]
        for (let i = 0; i <= firstText.length; i++) {
          displayText.value = firstText.substring(0, i)
          await sleep(props.typeSpeed)
        }
        isFinished.value = true // 完成后设置标记
        return // 完成后停止
      } else {
        currentIndex++
        requestAnimationFrame(typeText)
      }
    } else {
      requestAnimationFrame(typeText)
    }
  } else {
    // 打字效果
    displayText.value = currentText.substring(0, displayText.value.length + 1)
    await sleep(props.typeSpeed)
    
    if (displayText.value === currentText) {
      await sleep(props.delayBetween)
      isDeleting = true
      requestAnimationFrame(typeText)
    } else {
      requestAnimationFrame(typeText)
    }
  }
}

onMounted(() => {
  if (props.texts.length > 0) {
    typeText()
  }
})
</script>

<style scoped>
.typewriter-container {
  width: 100%;
}

.typewriter-content {
  display: inline;
  position: relative;
}

.typewriter-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: var(--vp-c-brand);
  margin-left: 1px;
  animation: blink 0.7s infinite;
  vertical-align: middle;
  transition: opacity 0.3s ease;
}

.hide-cursor {
  opacity: 0;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .typewriter-container {
    width: 100%;
  }
}
</style> 