

<template>

  <div class="circle"></div>
</template>

<style scoped>
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(90deg, #00ffcc 50%, #0055ff 50%);
  animation: rotate 3s linear infinite;
  position: relative;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
