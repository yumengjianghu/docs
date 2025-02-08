<template>
  <div class="doc-card-wrapper">
    <a :href="doc.path" class="doc-card-link">
      <div class="doc-card-content">
        <div class="doc-header">
          <h3 class="doc-title">{{ doc.title }}</h3>
          <span v-if="doc.star" class="doc-star">⭐</span>
        </div>

        <div class="doc-meta">
          <div class="doc-info">
            <span v-if="doc.date" class="doc-date">
              📅 {{ formatDate(doc.date) }}
            </span>
            <span v-if="doc.author" class="doc-author">
              👤 {{ doc.author }}
            </span>
          </div>
        </div>

        <div v-if="doc.description" class="doc-description">
          {{ doc.description }}
        </div>

        <div class="doc-footer">
          <div v-if="doc.category" class="doc-category">
            📁 {{ doc.category }}
          </div>
          <div v-if="doc.tags?.length" class="doc-tags">
            <span v-for="tag in doc.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
defineProps({
  doc: {
    type: Object,
    required: true
  }
})

// 格式化创建日期
const formatDate = (date) => {
  if (!date) return ''
  date = date.split('#')[0].trim()
  const [year, month, day] = date.split('-').map(s => s.trim())
  return `${year}年${month}月${day}日`
}

// 格式化最后更新时间
const formatLastUpdated = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.doc-card-wrapper {
  height: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.doc-card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doc-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.doc-card-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.doc-title {
  margin: 0;
  font-size: 1.1em;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.doc-meta {
  margin-bottom: 8px;
}

.doc-info {
  display: flex;
  gap: 12px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

.doc-description {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  line-height: 1.5;
}

.doc-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.doc-category {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.8em;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  color: var(--vp-c-text-1);
}
</style> 