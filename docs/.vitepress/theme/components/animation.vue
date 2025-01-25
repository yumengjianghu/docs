<template>
    <div class="video-player">
      <!-- 视频元素 -->
      <video
        ref="videoElement"
        :src="videoSrc"
        @timeupdate="updateProgress"
        @loadedmetadata="updateDuration"
      >
        <!-- 字幕轨道 -->
        <track
          v-for="(subtitle, index) in subtitles"
          :key="index"
          kind="subtitles"
          :src="subtitle.src"
          :srclang="subtitle.lang"
          :label="subtitle.label"
          default
        />
      </video>
  
      <!-- 控制栏 -->
      <div class="controls">
        <!-- 播放/暂停按钮 -->
        <button @click="togglePlay">
          {{ isPlaying ? "暂停" : "播放" }}
        </button>
  
        <!-- 进度条 -->
        <input
          type="range"
          v-model="currentTime"
          min="0"
          :max="duration"
          @input="seekVideo"
        />
  
        <!-- 音量控制 -->
        <input
          type="range"
          v-model="volume"
          min="0"
          max="1"
          step="0.1"
          @input="setVolume"
        />
  
        <!-- 倍速播放 -->
        <select v-model="playbackRate" @change="setPlaybackRate" class="speed">
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
  
        <!-- 画中画模式 -->
        <button @click="togglePictureInPicture">
          {{ isPictureInPicture ? "退出画中画" : "画中画" }}
        </button>
  
        <!-- 全屏按钮 -->
        <button @click="toggleFullscreen">全屏</button>
      </div>
    </div>
    <!-- <a href="/docs/video.mp4" download="video.mp4">下载PDF文件</a> -->
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from "vue";
  
  export default {
    name: "VideoPlayer",
    props: {
      videoSrc: {
        type: String,
        required: true,
      },
      subtitles: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const videoElement = ref(null); // 视频元素引用
      const isPlaying = ref(false); // 是否正在播放
      const currentTime = ref(0); // 当前播放时间
      const duration = ref(0); // 视频总时长
      const volume = ref(1); // 音量
      const playbackRate = ref(1); // 播放速度
      const isPictureInPicture = ref(false); // 是否处于画中画模式
  
      // 播放/暂停
      const togglePlay = () => {
        if (isPlaying.value) {
          videoElement.value.pause();
        } else {
          videoElement.value.play();
        }
        isPlaying.value = !isPlaying.value;
      };
  
      // 更新播放进度
      const updateProgress = () => {
        currentTime.value = videoElement.value.currentTime;
      };
  
      // 更新视频总时长
      const updateDuration = () => {
        duration.value = videoElement.value.duration;
      };
  
      // 跳转到指定时间
      const seekVideo = () => {
        videoElement.value.currentTime = currentTime.value;
      };
  
      // 设置音量
      const setVolume = () => {
        videoElement.value.volume = volume.value;
      };
  
      // 设置播放速度
      const setPlaybackRate = () => {
        videoElement.value.playbackRate = playbackRate.value;
      };
  
      // 切换画中画模式
      const togglePictureInPicture = async () => {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          isPictureInPicture.value = false;
        } else {
          await videoElement.value.requestPictureInPicture();
          isPictureInPicture.value = true;
        }
      };
  
      // 切换全屏
      const toggleFullscreen = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoElement.value.requestFullscreen();
        }
      };
  
      // 监听画中画模式变化
      const handlePictureInPictureChange = () => {
        isPictureInPicture.value = document.pictureInPictureElement === videoElement.value;
      };
  
      // 组件挂载时初始化音量和监听器
      onMounted(() => {
        videoElement.value.volume = volume.value;
        videoElement.value.playbackRate = playbackRate.value;
        document.addEventListener("enterpictureinpicture", handlePictureInPictureChange);
        document.addEventListener("leavepictureinpicture", handlePictureInPictureChange);
      });
  
      // 组件卸载时移除监听器
      onUnmounted(() => {
        document.removeEventListener("enterpictureinpicture", handlePictureInPictureChange);
        document.removeEventListener("leavepictureinpicture", handlePictureInPictureChange);
      });
  
      return {
        videoElement,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        isPictureInPicture,
        togglePlay,
        updateProgress,
        updateDuration,
        seekVideo,
        setVolume,
        setPlaybackRate,
        togglePictureInPicture,
        toggleFullscreen,
      };
    },
  };
  </script>
  
  <style scoped>
  .speed{
    color: black;
    text-align: center
  }
  .video-player {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ccc;
  }
  
  video {
    width: 100%;
    display: block;
  }
  
  .controls {
    display: flex;
    align-items: center;
    padding: 10px;
    /* background: rgba(0, 0, 0, 0.7); */
    color: #fff;
  }
  
  button {
    background: #6e6e6e;
    color: #fff;
    border: none;
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  input[type="range"] {
    flex: 1;
    margin: 0 10px;
    cursor: pointer;
  }
  
  select {
    padding: 5px;
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>