
<getdocs/>


```vue preview
<template>
  <div>当前计数为：{{ count }}</div>
  <br />
  <button @click="count++">点我！</button>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```