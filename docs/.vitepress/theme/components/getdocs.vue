// src/components/DocumentRenderer.vue
<template>
  <div class="docs-container">
    <!-- 文档列表 -->
    <div v-if="!currentDoc">
      <!-- 列表加载状态 -->
      <div v-if="isLoading" class="loading-wrapper">
        <loading-dots />
        <div class="loading-text">加载文档列表中...</div>
      </div>
      
      <!-- 文档列表内容 -->
      <div v-else class="docs-list">
        <div 
          v-for="doc in documents" 
          :key="doc.id" 
          class="doc-item"
          @click="loadFullDoc(doc.id)"
          :class="{ 'loading': loadingDocId === doc.id }"
        >
          <div class="doc-content">
            <h2 class="doc-title">{{ doc.title }}</h2>
            <div class="doc-meta">
              <span class="doc-date">{{ formatDate(doc.date) }}</span>
              <span class="doc-author">{{ doc.author }}</span>
            </div>
            <div class="doc-category">{{ doc.category }}</div>
            <div class="doc-tags">
              <span 
                v-for="(tag, index) in doc.tags" 
                :key="index" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            <p class="doc-description">{{ doc.description }}</p>
          </div>
          <!-- 加载动画覆盖层 -->
          <div class="loading-overlay" v-if="loadingDocId === doc.id">
            <loading-dots />
          </div>
        </div>
      </div>
    </div>

    <!-- 文档详情 -->
    <div v-else class="doc-container">
      <div class="doc-sidebar">
        <button class="back-btn" @click="currentDoc = null">
          <span class="back-arrow">←</span>
          返回列表
        </button>
      </div>
      
      <!-- 文档详情加载状态 -->
      <div v-if="isLoadingDoc" class="loading-wrapper">
        <loading-dots />
        <div class="loading-text">加载文档内容中...</div>
      </div>
      
      <!-- 文档详情内容 -->
      <div v-else class="doc-detail vp-doc">
        <div class="doc-header">
          <h1>{{ currentDoc.title }}</h1>
          <div class="doc-meta">
            <span class="doc-date">{{ formatDate(currentDoc.date) }}</span>
            <span class="doc-author">{{ currentDoc.author }}</span>
          </div>
          <div class="doc-tags">
            <span v-for="(tag, index) in currentDoc.tags" :key="index" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="doc-content" v-html="currentDoc.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' 
import LoadingDots from './Loading.vue'
import 'highlight.js/styles/github-dark.css'

// Supabase 配置
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const documents = ref([])
const currentDoc = ref(null)

// 添加加载状态
const isLoading = ref(false)
const isLoadingDoc = ref(false)

// 添加正在加载的文档ID
const loadingDocId = ref(null)

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取文档列表
const fetchDocuments = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, date, author, category, tags, description')

    if (error) throw error

    documents.value = data.map(doc => ({
      ...doc,
      tags: typeof doc.tags === 'string' 
        ? JSON.parse(doc.tags) 
        : (Array.isArray(doc.tags) ? doc.tags : [])
    }))
  } catch (error) {
    console.error('获取文档列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 配置 MarkdownIt
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="language-${lang}"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="language-text"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 自定义图片渲染规则
md.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.content || ''
  
  // 处理图片路径
  let imgSrc = src
  if (src.startsWith('assets/')) {
    imgSrc = `/assets/${src.replace('assets/', '')}`
  }
  
  return `<img src="${imgSrc}" alt="${alt}" loading="lazy" class="vp-doc-image">`
}

// 修改加载文档方法
const loadFullDoc = async (docId) => {
  if (loadingDocId.value === docId) return
  
  try {
    loadingDocId.value = docId
    isLoadingDoc.value = true
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', docId)
      .single()

    if (error) throw error

    const tagsArray = typeof data.tags === 'string' 
      ? JSON.parse(data.tags) 
      : (Array.isArray(data.tags) ? data.tags : [])

    const content = data.content.replace(/^---[\s\S]*?---\n/, '')

    currentDoc.value = {
      ...data,
      tags: tagsArray,
      content: content
    }
  } catch (error) {
    console.error('获取文档详情失败:', error)
  } finally {
    loadingDocId.value = null
    isLoadingDoc.value = false
  }
}

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!currentDoc.value?.content) return ''
  try {
    return md.render(currentDoc.value.content)
  } catch (error) {
    console.error('渲染失败:', error)
    return '内容渲染失败'
  }
})

// 初始加载
fetchDocuments()
</script>

<style>
/* VitePress 文档样式 */
.vp-doc {
  font-size: 16px;
  line-height: 1.8;
  color: var(--vp-c-text-1);
}

.vp-doc h1,
.vp-doc h2,
.vp-doc h3,
.vp-doc h4,
.vp-doc h5,
.vp-doc h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.vp-doc h1 { font-size: 2em; }
.vp-doc h2 { font-size: 1.5em; }
.vp-doc h3 { font-size: 1.25em; }

.vp-doc p {
  margin: 16px 0;
  line-height: 1.7;
}

.vp-doc img {
  max-width: 100%;
  height: auto;
  margin: 16px 0;
  border-radius: 8px;
}

.vp-doc pre {
  margin: 16px 0;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow-x: auto;
}

.vp-doc code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.875em;
  color: var(--vp-c-text-code);
  padding: 2px 4px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.vp-doc pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}

.vp-doc blockquote {
  margin: 16px 0;
  padding: 0 16px;
  border-left: 4px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

/* 添加图片样式 */
.vp-doc-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 代码高亮样式 */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

.vp-doc pre {
  margin: 1em 0;
}

.vp-doc pre code {
  display: block;
  padding: 0;
  background: transparent;
}
</style>

<style scoped>
/* 文档列表样式 */
.docs-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: 900px;
  margin: 0 auto;
}

.doc-item {
  position: relative;
  display: grid;
  grid-template-areas:
    "title meta"
    "category tags"
    "description description";
  grid-template-columns: 1fr auto;
  gap: 0.25rem 1rem;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.doc-item:hover {
  transform: translateX(4px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doc-title {
  grid-area: title;
  font-size: 1.1rem;
  margin: 0;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
  font-weight: 600;
  line-height: 1.2;
}

.doc-meta {
  grid-area: meta;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  gap: 0.5rem;
}

.doc-meta > span:not(:last-child)::after {
  content: "•";
  margin-left: 0.5rem;
  opacity: 0.6;
}

.doc-category {
  grid-area: category;
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.doc-tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  align-items: center;
}

.tag {
  padding: 0 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  border-radius: 3px;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: nowrap;
}

.doc-description {
  grid-area: description;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.3;
  max-height: 2.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 文档容器布局 */
.doc-container {
  display: flex;
  gap: 2rem;
  position: relative;
}

.doc-sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
  padding-right: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.back-btn:hover {
  /* background: var(--vp-c-brand-dark); */
  transform: translateX(-2px);

}

.back-arrow {
  font-size: 1.2em;
  line-height: 1;
}

/* 文档详情容器 */
.doc-detail {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.doc-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .docs-list {
    padding: 0 0.5rem;
    gap: 0.6rem;  /* 增加列表项间距 */
  }

  .doc-item {
    grid-template-areas:
      "title"
      "meta"
      "category"
      "tags"
      "description";
    grid-template-columns: 1fr;
    gap: 0.4rem;  /* 增加内部元素间距 */
    padding: 0.8rem;  /* 增加内边距 */
  }

  .doc-title {
    font-size: 1rem;  /* 稍微调整标题大小 */
    line-height: 1.3;
  }

  .doc-meta {
    flex-wrap: wrap;
    gap: 0.4rem;  /* 增加元数据项间距 */
    font-size: 0.85rem;
  }

  .doc-meta > span:not(:last-child)::after {
    content: "•";
    margin-left: 0.4rem;
  }

  .doc-category {
    margin: 0.2rem 0;  /* 添加上下边距 */
  }

  .doc-tags {
    justify-content: flex-start;
    margin: 0.2rem 0;  /* 添加上下边距 */
    gap: 0.4rem;  /* 增加标签间距 */
  }

  .tag {
    padding: 0.1rem 0.5rem;  /* 增加标签内边距 */
    font-size: 0.75rem;
  }

  .doc-description {
    margin-top: 0.2rem;  /* 添加描述顶部边距 */
    font-size: 0.85rem;
    line-height: 1.4;
  }

  /* 调整加载状态样式 */
  .loading-wrapper {
    min-height: 150px;
    padding: 1rem;
  }

  .loading-text {
    font-size: 0.85rem;
    margin-top: 0.8rem;
  }

  .doc-container {
    flex-direction: column;
    gap: 1rem;
  }

  .doc-sidebar {
    position: static;
    padding: 1rem;
    margin: -1rem -1rem 0;
    background: var(--vp-c-bg);
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .back-btn:hover {
    transform: none;
  }

  .doc-detail {
    padding: 1rem;
    border-radius: 0;
  }
}

/* 加载状态容器样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* 加载状态包装器样式 */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
}

.loading-text {
  margin-top: 16px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

/* 在文档详情中的加载状态 */
.doc-container .loading-wrapper {
  flex: 1;
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式设计中添加 */
@media (max-width: 768px) {
  .loading-wrapper {
    min-height: 200px;
  }
  
  .doc-container .loading-wrapper {
    padding: 1rem;
    border-radius: 0;
  }
}

/* 加载状态样式 */
.doc-item.loading {
  pointer-events: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--vp-c-bg-rgb), 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .loading-overlay {
    background: rgba(var(--vp-c-bg-rgb), 0.9);
  }
}

/* 添加文档内容样式 */
.doc-content {
  font-size: 16px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.doc-content :deep(h1),
.doc-content :deep(h2),
.doc-content :deep(h3),
.doc-content :deep(h4),
.doc-content :deep(h5),
.doc-content :deep(h6) {
  margin: 1.5em 0 0.5em;
  font-weight: 600;
  line-height: 1.4;
}

.doc-content :deep(p) {
  margin: 1em 0;
}

.doc-content :deep(strong) {
  font-weight: 600;
}

.doc-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.doc-content :deep(pre) {
  padding: 1em;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
}

.doc-content :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  color: var(--vp-c-text-code);
}

.doc-content :deep(blockquote) {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.doc-content :deep(ul),
.doc-content :deep(ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

.doc-content :deep(li) {
  margin: 0.5em 0;
}

/* 添加表格样式 */
.doc-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.doc-content :deep(th),
.doc-content :deep(td) {
  padding: 0.75em;
  border: 1px solid var(--vp-c-divider);
  text-align: left;
}

.doc-content :deep(th) {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
}
</style>
