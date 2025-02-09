<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="scroll-button" @click="scrollToBottom" title="自动滚动">
        <div class="scroll-icon">↓</div>
      </div>
      <div class="timeline-line"></div>
      <div
        v-for="(item, index) in timelineData"
        :key="index"
        class="timeline-item"
        :class="[index % 2 === 0 ? 'left' : 'right']"
        v-motion
        :initial="{
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          y: 0
        }"
        :visibleOnce="{
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 200,
            delay: index * 50
          }
        }"
      >
        <div class="timeline-content">
          <div 
            class="timeline-cover" 
            :class="{ 'no-image': !item.image }"
            :style="item.image ? `background-image: url(${item.image})` : ''"
          ></div>
          <div class="content-text">
            <div class="header-row">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <div class="timeline-date">{{ item.date }}</div>
            </div>
            <p class="timeline-description">{{ item.description }}</p>
          </div>
        </div>
        <div class="timeline-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timelineData = ref([
  {
    date: '2024-1-1',
    title: '里程碑事件1',
    description: '取得一些小成绩或完成一些有趣项目',
    // image: 'https://s21.ax1x.com/2025/02/09/pEm7fWd.webp' // 可选
  },
  {
    date: '2024-02-15',
    title: '里程碑事件2',
    description: '没有图片的事件样例',
    // image: 'https://s21.ax1x.com/2025/02/03/pEZTfv6.png' // 可选

  },
  {
    date: '2024-01-10',
    title: '里程碑事件3',
    description: '第三个重要事件的描述内容。',
    // image: 'https://s21.ax1x.com/2025/02/03/pEZT4KK.png'
  },
  {
    date: '2024-01-10',
    title: '里程碑事件4',
    description: '第三个重要事件的描述内容。',
    // image: 'https://s21.ax1x.com/2025/01/31/pEZ9eG8.jpg'
  },
  {
    date: '2024-01-10',
    title: '里程碑事件5',
    description: '第三个重要事件的描述内容。',
    // image: 'https://s21.ax1x.com/2025/01/30/pEVIocT.png'
  },
  {
    date: '2024-01-10',
    title: '里程碑事件6',
    description: '第三个重要事件的描述内容。',
    // image: 'https://s21.ax1x.com/2025/01/30/pEVIocT.png'
  },
  {
    date: '2024-01-10',
    title: '里程碑事件7',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件8',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件9',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件10',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件11',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件12',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件13',
    description: '第三个重要事件的描述内容。',
  },
  {
    date: '2024-01-10',
    title: '里程碑事件14',
    description: '第三个重要事件的描述内容。',
  },
])

const scrollToBottom = () => {
  const scrollStep = window.innerHeight / 150; // 每次滚动的高度
  const scrollInterval = setInterval(() => {
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 16); // 每帧约16ms，接近60fps
}
</script>

<style scoped>
.timeline-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background-color: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin: 2rem 0;
  width: 50%;
  padding: 0 2rem;
  transition: all 0.5s ease;
}

.timeline-item.left {
  left: 0;
}

.timeline-item.right {
  left: 50%;
}

.timeline-content {
  background: var(--time-bg-color);
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.timeline-content:hover {
  transform: translateY(-5px);
}

.timeline-cover {
  height: 300px;
  /*  */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.timeline-cover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--time-bg-color)
  );
  pointer-events: none;
}

.content-text {
  padding: 1rem;
  position: relative;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* 左侧项目的样式 */
.timeline-item.left .content-text {
  padding-right: 1rem;
  text-align: left;
}

.timeline-item.left .header-row {
  flex-direction: row;
}

/* 右侧项目的样式 */
.timeline-item.right .content-text {
  padding-left: 1rem;
  text-align: right;
}

.timeline-item.right .header-row {
  flex-direction: row-reverse;
}

.timeline-cover.no-image {
  height: 200px;
  background: linear-gradient(-45deg, var(--bear-bg-color1) 50%, var(--bear-bg-color2) 50%);
  filter: blur(100px);
}

.timeline-date {
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
  margin: 0 0.5rem;
}

.timeline-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--vp-c-text-1);
}

.timeline-description {
  color: #666;
  line-height: 1.5;
  margin-top: 0.5rem;
}

.timeline-dot {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-item.left .timeline-dot {
  right: -8px;
}

.timeline-item.right .timeline-dot {
  left: -8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-line {
    left: 0;
  }

  .timeline-item {
    width: 100%;
    left: 0 !important;
    padding-left: 2rem;
  }

  .timeline-dot {
    left: -8px !important;
  }

  .timeline-content {
    max-width: 100%;
  }

  .timeline-cover {
    height: 200px;
  }
  
  .timeline-item.left .content-text,
  .timeline-item.right .content-text {
    padding: 1rem;
    text-align: left;
  }

  .timeline-item.left .header-row,
  .timeline-item.right .header-row {
    flex-direction: row;
  }

  .timeline-item.left .timeline-date,
  .timeline-item.right .timeline-date {
    position: static;
    margin-top: 0.5rem;
  }

  .scroll-button {
    left: 0;
    transform: none;
  }
  
  .scroll-button:hover {
    transform: translateY(2px);
  }
}

/* 动画相关 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.scroll-button {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--time-bg-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

.scroll-button:hover {
  transform: translateX(-50%) translateY(2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.scroll-icon {
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}
</style>
