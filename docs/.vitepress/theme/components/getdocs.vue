// src/components/DocumentRenderer.vue
<template>
  <div class="docs-container">
    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文档标题、描述或标签..." 
          class="search-input"
          @input="handleSearch"
        >
        <span class="search-icon">🔍</span>
      </div>
    </div>

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
          v-for="doc in filteredDocuments" 
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
        
        <!-- 无搜索结果提示 -->
        <div v-if="filteredDocuments.length === 0" class="no-results">
          <p>没有找到匹配的文档</p>
          <button @click="clearSearch" class="clear-search">清除搜索</button>
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
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

const documents = ref([])
const currentDoc = ref(null)

// 添加加载状态
const isLoading = ref(false)
const isLoadingDoc = ref(false)

// 添加正在加载的文档ID
const loadingDocId = ref(null)

// 添加搜索相关的状态
const searchQuery = ref('')
const searchDebounceTimeout = ref(null)

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
      .select('id, title, date, created_at, author, category, tags, description')
      .order('created_at', { ascending: false })
      .order('date', { ascending: false })

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

// 处理搜索输入
const handleSearch = () => {
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value)
  }
  searchDebounceTimeout.value = setTimeout(() => {
    // 搜索逻辑在 filteredDocuments 计算属性中处理
  }, 300)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

// 修改过滤文档的计算属性
const filteredDocuments = computed(() => {
  let docs = documents.value

  // 如果有搜索查询，进行过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    docs = docs.filter(doc => {
      const title = doc.title?.toLowerCase() || ''
      const description = doc.description?.toLowerCase() || ''
      const tags = doc.tags?.map(tag => tag.toLowerCase()) || []
      const category = doc.category?.toLowerCase() || ''
      const author = doc.author?.toLowerCase() || ''

      return (
        title.includes(query) ||
        description.includes(query) ||
        tags.some(tag => tag.includes(query)) ||
        category.includes(query) ||
        author.includes(query)
      )
    })
  }

  // 如果需要本地再次排序
  return docs.sort((a, b) => {
    // 首先按创建时间排序
    const timeA = new Date(a.created_at).getTime()
    const timeB = new Date(b.created_at).getTime()
    if (timeA !== timeB) return timeB - timeA

    // 如果创建时间相同，则按日期排序
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
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
  gap: 0.5rem;
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
  gap: 0.3rem 1.2rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
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
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  font-weight: 600;
  line-height: 1.3;
}

.doc-meta {
  grid-area: meta;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  gap: 0.6rem;
  margin: 0;
}

.doc-meta > span:not(:last-child)::after {
  content: "•";
  margin-left: 0.6rem;
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
  gap: 0.4rem;
  justify-content: flex-end;
  align-items: center;
  padding: 4px;
  margin: 0;
}

.tag {
  padding: 0.1rem 0.5rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  line-height: 1.4;
}

.doc-description {
  grid-area: description;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.4;
  max-height: 2.8em;
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
    padding: 0 0.8rem;
  }

  .doc-item {
    grid-template-areas:
      "title"
      "meta"
      "category"
      "tags"
      "description";
    grid-template-columns: 1fr;
    gap: 0.3rem;
    padding: 0.6rem 0.8rem;
  }

  .doc-meta {
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .doc-tags {
    justify-content: flex-start;
    margin-top: 0.2rem;
  }

  .tag {
    padding: 0.1rem 0.4rem;
  }

  .doc-description {
    margin-top: 0.2rem;
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

/* 搜索框样式 */
.search-container {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
  pointer-events: none;
}

/* 无搜索结果样式 */
.no-results {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.clear-search {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    padding: 0 0.5rem;
  }

  .search-input {
    font-size: 0.9rem;
    padding: 0.6rem 1rem 0.6rem 2.2rem;
  }

  .search-icon {
    left: 0.6rem;
    font-size: 0.9rem;
  }
}
</style>
