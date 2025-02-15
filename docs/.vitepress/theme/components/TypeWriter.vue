<template>
  <div class="typewriter-container">
    <div class="typewriter-content">
      <span class="typewriter-text">{{ displayText }}</span><!--
      --><span class="cursor"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 100
  }
})

const displayText = ref('')

onMounted(() => {
  let index = 0
  const timer = setInterval(() => {
    if (index < props.text.length) {
      displayText.value = props.text.slice(0, index + 1)
      index++
    } else {
      clearInterval(timer)
    }
  }, props.speed)
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