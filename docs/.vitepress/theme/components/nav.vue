<template>
  <div class="tools-container">
    <div class="tools-grid">
      <a v-for="(tool, index) in tools" 
         :key="tool.url + index"
         :href="tool.url"
         target="_blank"
         rel="noopener"
         class="tool-card"
         :class="tool.badge ? `badge-${tool.badgeType || 'default'}` : ''"
         :style="{ width: '250px', height: '100px' }"
      >
        <span v-if="tool.badge" class="tool-badge" :class="tool.badgeType || 'default'">
          {{ tool.badge }}
        </span>

        <div class="tool-icon">
          <img 
            :src="tool.icon || getFavicon(tool.url)" 
            :alt="tool.title"
            loading="lazy"
            @error="handleImageError(tool)"
          >
        </div>
        <div class="tool-content">
          <h3 class="tool-title">{{ tool.title || '待添加' }}</h3>
          <p class="tool-desc">{{ tool.desc || '暂无描述' }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tools: {
    type: Array,
    default: () => []
  }
})

// 过滤掉空的工具项
const validTools = computed(() => {
  return props.tools.filter(tool => tool.url && tool.title)
})

// 改进的图标获取方法
const getFavicon = (url) => {
  try {
    const domain = new URL(url).hostname
    return `https://favicon.yandex.net/favicon/${domain}?size=32`
  } catch (e) {
    return 'https://s21.ax1x.com/2025/01/31/pEZi6J0.png'
  }
}

// 图片加载失败处理
const handleImageError = (tool) => {
  const img = event.target
  // 如果是自定义图标加载失败，尝试使用 favicon
  if (tool.icon && img.src === tool.icon) {
    img.src = getFavicon(tool.url)
    return
  }
  
  const domain = new URL(tool.url).hostname
  // 尝试其他源
  if (!img.src.includes('icon.horse')) {
    img.src = `https://icon.horse/icon/${domain}`
  } else if (!img.src.includes('google.com')) {
    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } else {
    img.src = 'https://s21.ax1x.com/2025/01/31/pEZi6J0.png'
  }
}
</script>

<style scoped>
.tools-container {
  margin-bottom: 2rem;
}

.tools-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

.tool-card {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.tool-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
}

.tool-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.tool-card:hover .tool-icon {
  transform: scale(1.1);
  border-color: var(--vp-c-brand-soft);
}

.tool-content {
  flex: 1;
  min-width: 0;
}

.tool-title {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-desc {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .tool-card {
    background: var(--vp-c-bg-mute);
  }

  .tool-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tools-grid {
    justify-content: center;
  }
  
  .tool-card {
    width: 100% !important;
    max-width: 300px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

/* 修改角标和卡片悬浮样式 */
.tool-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 10px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

/* 默认悬浮效果 */
.tool-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 带角标卡片的悬浮效果 */
.tool-card.badge-default:hover {
  border-color: var(--vp-c-brand);
}

.tool-card.badge-new:hover {
  border-color: #42b883;
}

.tool-card.badge-hot:hover {
  border-color: #f56c6c;
}

.tool-card.badge-beta:hover {
  border-color: #e6a23c;
}

/* 角标类型 */
.tool-badge.default {
  background: var(--vp-c-brand);
}

.tool-badge.new {
  background: #42b883;
}

.tool-badge.hot {
  background: #f56c6c;
}

.tool-badge.beta {
  background: #e6a23c;
}
</style>
