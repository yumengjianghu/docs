<template>
  <div class="classification-container">
    <!-- 添加调试信息显示 -->
    <div v-if="documents.length === 0" class="debug-info">
      正在加载文档...
    </div>
    <div v-else class="debug-info">
      已加载 {{ documents.length }} 个文档
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input type="text" v-model="searchQuery" placeholder="搜索文档标题或描述..." class="search-input">
    </div>

    <div class="filters">
      <!-- 分类筛选 -->
      <div class="filter-section" v-if="categories.length">
        <h3>分类筛选</h3>
        <div class="categories-filter">
          <button v-for="category in categories" :key="category"
            :class="['filter-btn category-btn', selectedCategory === category ? 'active' : '']"
            @click="selectCategory(category)">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div class="filter-section" v-if="tags.length">
        <h3>标签筛选</h3>
        <div class="tags-filter">
          <button v-for="tag in tags" :key="tag"
            :class="['filter-btn tag-btn', selectedTags.includes(tag) ? 'active' : '']" 
            @click="toggleTag(tag)">
            {{ tag }}
          </button>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="documents-list">
      <!-- 置顶文档 -->
      <div v-if="stickyDocs.length" class="sticky-docs">
        <h3 class="section-title">📌 置顶文档</h3>
        <div class="docs-grid">
          <div v-for="doc in stickyDocs" :key="doc.path" class="doc-card sticky">
            <doc-card :doc="doc" />
          </div>
        </div>
      </div>

      <!-- 普通文档 -->
      <div v-if="paginatedDocs.length" class="normal-docs">
        <h3 class="section-title" v-if="stickyDocs.length">📑 全部文档</h3>
        <div class="docs-grid">
          <div v-for="doc in paginatedDocs" :key="doc.path" class="doc-card">
            <doc-card :doc="doc" />
          </div>
        </div>
      </div>

      <div v-if="!paginatedDocs.length && !stickyDocs.length" class="no-docs">
        暂无符合条件的文档
      </div>

      <!-- 分页控件 -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import DocCard from './DocCard.vue'

const { theme } = useData()

// 状态管理
const documents = ref([])
const selectedTags = ref([])
const selectedCategory = ref(null)
const searchQuery = ref('') 
const currentPage = ref(1)
const pageSize = 12

// 获取文档列表
const fetchDocuments = async () => {
  try {
    const modules = import.meta.glob('/pages/**/note.md', { eager: true })
    const docs = []

    for (const path in modules) {
      try {
        const mod = modules[path]
        console.log('Raw module:', mod)

        // 从路径中获取文档标题（文件夹名称）
        const folderName = path.split('/').slice(-2, -1)[0]
        
        // 尝试获取文档内容
        let content = ''
        let frontmatter = {}

        // 方法1: 从 __pageData 获取
        if (mod.__pageData) {
          const pageData = mod.__pageData
          frontmatter = pageData.frontmatter || {}
        }
        // 方法2: 从 default 获取
        else if (mod.default?.frontmatter) {
          frontmatter = mod.default.frontmatter
        }
        // 方法3: 从 raw 内容获取
        else if (mod.default?.raw || mod.default?.content || mod.default) {
          content = mod.default.raw || mod.default.content || mod.default
          if (typeof content === 'string') {
            const match = content.match(/^---\n([\s\S]*?)\n---/)
            if (match) {
              try {
                const yaml = match[1]
                const lines = yaml.split('\n')
                let currentKey = ''
                let isArray = false
                let arrayItems = []

                lines.forEach(line => {
                  if (!line.trim() || line.trim().startsWith('#')) return
                  
                  if (line.includes(':')) {
                    // 如果有之前的数组，保存它
                    if (isArray && currentKey) {
                      frontmatter[currentKey] = arrayItems
                      arrayItems = []
                      isArray = false
                    }
                    
                    const [key, ...values] = line.split(':')
                    currentKey = key.trim()
                    const value = values.join(':').trim()
                    
                    if (!value) {
                      isArray = true
                    } else {
                      frontmatter[currentKey] = value.split('#')[0].trim()
                    }
                  } else if (line.trim().startsWith('-') && isArray) {
                    const value = line.trim().substring(1).trim()
                    if (value) {
                      arrayItems.push(value.split('#')[0].trim())
                    }
                  }
                })

                // 保存最后一个数组
                if (isArray && currentKey && arrayItems.length) {
                  frontmatter[currentKey] = arrayItems
                }
              } catch (e) {
                console.warn('解析 frontmatter 失败:', e)
              }
            }
          }
        }

        console.log('Processed frontmatter:', frontmatter)

        // 构建文档信息
        const docInfo = {
          title: frontmatter.title || folderName,
          path: path.replace('.md', '.html'),
          author: frontmatter.author?.split('#')[0].trim() || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          category: frontmatter.category?.split('#')[0].trim() || '',
          description: frontmatter.description?.split('#')[0].trim() || '',
          sticky: frontmatter.sticky || 0,
          star: frontmatter.star || false,
          date: frontmatter.date || null
        }

        docs.push(docInfo)
        console.log('Added document:', docInfo)
      } catch (error) {
        console.error(`处理文档失败 ${path}:`, error)
      }
    }

    documents.value = docs
    console.log('加载的文档总数:', docs.length)
  } catch (error) {
    console.error('获取文档失败:', error)
  }
}

// 计算所有标签
const tags = computed(() => {
  const allTags = new Set()
  documents.value.forEach(doc => {
    if (doc.tags) {
      doc.tags.forEach(tag => allTags.add(tag))
    }
  })
  return Array.from(allTags).sort()
})

// 计算所有分类
const categories = computed(() => {
  const allCategories = new Set(documents.value.map(doc => doc.category).filter(Boolean))
  return Array.from(allCategories).sort()
})

// 筛选文档
const filteredDocs = computed(() => {
  try {
    let filtered = [...documents.value]

    // 搜索筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(doc =>
        (doc.title?.toLowerCase().includes(query) || false) ||
        (doc.description?.toLowerCase().includes(query) || false)
      )
    }

    // 标签筛选
    if (selectedTags.value.length) {
      filtered = filtered.filter(doc =>
        doc.tags && selectedTags.value.every(tag => doc.tags.includes(tag))
      )
    }

    // 分类筛选
    if (selectedCategory.value) {
      filtered = filtered.filter(doc =>
        doc.category === selectedCategory.value
      )
    }

    return filtered.sort((a, b) => {
      // 首先按置顶排序
      if (a.sticky !== b.sticky) return b.sticky - a.sticky
      if (a.sticky) return -1
      if (b.sticky) return 1
      
      // 然后按标题排序
      return a.title.localeCompare(b.title, 'zh-CN')
    })
  } catch (error) {
    console.error('筛选文档时出错:', error)
    return []
  }
})

// 置顶文档
const stickyDocs = computed(() => {
  return filteredDocs.value.filter(doc => doc.sticky)
})

// 普通文档（非置顶）
const normalDocs = computed(() => {
  return filteredDocs.value.filter(doc => !doc.sticky)
})

// 分页
const totalPages = computed(() =>
  Math.ceil(normalDocs.value.length / pageSize)
)

const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return normalDocs.value.slice(start, end)
})

// 标签操作
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  currentPage.value = 1
}

// 分类操作
const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? null : category
  currentPage.value = 1
}

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.classification-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 1rem;
}

.filters {
  margin-bottom: 30px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: var(--vp-c-text-1);
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  position: relative;
}

.doc-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  position: relative;
  background: var(--vp-c-bg-soft);
  min-height: 150px;
  display: flex;
  flex-direction: column;
}

.doc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doc-card-link {
  text-decoration: none;
  color: inherit;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.doc-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.doc-title {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.doc-meta {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.no-docs {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

/* 添加一个简单的悬停效果 */
.doc-card:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid var(--vp-c-brand);
  pointer-events: none;
}

.tag-btn,
.category-btn {
  background: var(--vp-c-bg-soft);
  border-radius: 15px;
  padding: 4px 12px;
}

.doc-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8em;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
  color: var(--vp-c-text-1);
}

.doc-summary {
  margin-top: 8px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

.section-title {
  margin: 30px 0 20px;
  font-size: 1.2em;
  color: var(--vp-c-text-1);
}

.sticky-docs {
  margin-bottom: 40px;
}

.doc-card.sticky {
  border: 2px solid var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.doc-card.sticky::before {
  content: '📌';
  position: absolute;
  top: 8px;
  right: 8px;
}

/* 添加调试信息样式 */
.debug-info {
  padding: 10px;
  margin-bottom: 10px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

/* 修改悬浮信息的样式 */
.doc-hover-info {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}
</style>


