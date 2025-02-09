<style scoped>
.loader {
  position: relative;
  width: 120px;
  height: 90px;
  /* margin: 0 auto; */
  margin: 20px 0;
  /* border: 1px solid red; */

}

.loader:before {
  content: "⏰";
  color: white;
  font-size: 50px;
  position: absolute;
  bottom: 0px;
  left: 50px;
  height: 0px;
  width: 30px;
  /* border-radius: 50%; */
  /* background: #2a589d; */
  animation: loading-bounce 0.4s  ease-in-out infinite alternate;
  /* border: 1px solid red; */
}

.loader:after {
  content: "💻";
  color: white;
  font-size: 50px;
  position: absolute;
  bottom: 0px;
  left: 150px;
  height: 0px;
  width: 30px;
  animation: loading-bounce 0.5s ease-in-out infinite alternate;
}

@keyframes loading-bounce {
  0% {
    transform: scale(1, 0.7);
  }

  40% {
    transform: scale(0.8, 1.2);
  }

  60% {
    transform: scale(1, 1);
  }

  100% {
    bottom: 140px;
  }
}
</style>

<template>
  <div class="loader"></div>
</template>