<template>
  <div class="classification-container">
    <!-- 添加调试信息显示 -->
    <div v-if="documents.length === 0" class="debug-info">
      正在加载文档...
    </div>
    <div v-else class="debug-info">
      已加载 {{ documents.length }} 个文档
    </div>

    <!-- 搜索和排序 -->
    <div class="control-panel">
      <!-- 搜索框 -->
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="搜索文档标题或描述..." class="search-input">
      </div>

      <!-- 排序按钮组 -->
      <div class="sort-buttons">
        <button :class="['sort-btn', sortType === 'default' ? 'active' : '']" @click="sortType = 'default'">
          默认排序
        </button>
        <button :class="['sort-btn', sortType === 'newest' ? 'active' : '']" @click="sortType = 'newest'">
          最新优先
        </button>
        <button class="sort-btn WebDocs" @click="getWebDocs()">网络文档</button>
      </div>
    </div>

    <!-- 筛选器组 -->
    <div class="filters">
      <!-- 分类筛选 -->
      <div class="filter-section" v-if="allCategories.length">
        <h3>分类筛选</h3>
        <div class="categories-filter">
          <button v-for="category in allCategories" :key="category"
            :class="['category-btn', selectedCategory === category ? 'active' : '']" @click="toggleCategory(category)">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 标签筛选 -->
      <div class="filter-section" v-if="allTags.length">
        <h3>标签筛选</h3>
        <div class="tags-filter">
          <button v-for="tag in allTags" :key="tag" :class="['tag-btn', selectedTags.includes(tag) ? 'active' : '']"
            @click="toggleTag(tag)">
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 时间筛选 -->
      <div class="filter-section" v-if="dateFilters.length">
        <h3>时间筛选</h3>
        <div class="date-filters">
          <div class="year-filter">
            <button v-for="item in dateFilters" :key="item.year"
              :class="['year-btn', selectedYear === item.year ? 'active' : '']" @click="toggleYear(item.year)">
              {{ item.year }}
            </button>
          </div>
          <div class="month-filter" v-if="selectedYear">
            <button v-for="month in dateFilters.find(d => d.year === selectedYear)?.months" :key="month"
              :class="['month-btn', selectedMonth === month ? 'active' : '']" @click="toggleMonth(month)">
              {{ month }}月
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="documents-grid">
      <DocCard v-for="doc in paginatedDocs" :key="doc.path" :doc="doc" />
      <div v-if="!paginatedDocs.length" class="no-docs">
        暂无符合条件的文档
      </div>
    </div>

    <!-- 分页 -->
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import DocCard from './DocCard.vue'

const { theme } = useData()
const router = useRouter()

// 状态管理
const documents = ref([])
const selectedTags = ref([])
const selectedCategory = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 12
const sortType = ref('default')

const getWebDocs = () => {
  router.go('/getdoc')
}

// 计算所有可用的标签
const allTags = computed(() => {
  const tagSet = new Set()
  documents.value.forEach(doc => {
    if (Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

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

        // 确保 tags 是数组
        if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
          frontmatter.tags = [frontmatter.tags]
        }

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
        console.error(`Error processing document ${path}:`, error)
      }
    }

    documents.value = docs
    console.log('Total documents loaded:', docs.length)
    console.log('Available tags:', allTags.value)
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  }
}

// 计算所有分类
const allCategories = computed(() => {
  const categorySet = new Set()
  documents.value.forEach(doc => {
    if (doc.category) {
      categorySet.add(doc.category)
    }
  })
  return Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

// 计算所有可用的年份和月份
const dateFilters = computed(() => {
  const dateMap = new Map() // 年份 -> Set(月份)

  documents.value.forEach(doc => {
    if (doc.date) {
      const date = parseDate(doc.date)
      if (date && date.getTime() > 0) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        if (!dateMap.has(year)) {
          dateMap.set(year, new Set())
        }
        dateMap.get(year).add(month)
      }
    }
  })

  // 转换为排序后的数组
  return Array.from(dateMap.entries())
    .sort((a, b) => b[0] - a[0]) // 年份降序
    .map(([year, months]) => ({
      year,
      months: Array.from(months).sort((a, b) => a - b) // 月份升序
    }))
})

// 时间筛选状态
const selectedYear = ref(null)
const selectedMonth = ref(null)

// 时间筛选操作
const toggleYear = (year) => {
  if (selectedYear.value === year) {
    selectedYear.value = null
    selectedMonth.value = null
  } else {
    selectedYear.value = year
    selectedMonth.value = null
  }
  currentPage.value = 1
}

const toggleMonth = (month) => {
  if (selectedMonth.value === month) {
    selectedMonth.value = null
  } else {
    selectedMonth.value = month
  }
  currentPage.value = 1
}

// 修改文档筛选逻辑
const filteredDocs = computed(() => {
  try {
    let filtered = documents.value

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      )
    }

    // 标签过滤
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(doc =>
        doc.tags?.some(tag => selectedTags.value.includes(tag))
      )
    }

    // 分类过滤
    if (selectedCategory.value) {
      filtered = filtered.filter(doc =>
        doc.category === selectedCategory.value
      )
    }

    // 时间筛选
    if (selectedYear.value) {
      filtered = filtered.filter(doc => {
        if (!doc.date) return false
        const date = parseDate(doc.date)
        if (!date || date.getTime() === 0) return false

        const matches = date.getFullYear() === selectedYear.value
        if (selectedMonth.value) {
          return matches && (date.getMonth() + 1) === selectedMonth.value
        }
        return matches
      })
    }

    return filtered
  } catch (error) {
    console.error('筛选文档时出错:', error)
    return []
  }
})

// 添加日期解析函数
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0)
  try {
    // 移除注释并清理空格
    const cleanDate = dateStr.split('#')[0].trim()
    // 分割日期部分
    const [year, month, day] = cleanDate.split('-').map(s => s.trim())
    // 确保年月日都是有效数字
    if (!year || !month || !day) return new Date(0)
    // 创建日期对象 (月份需要减1因为 JavaScript 月份从0开始)
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  } catch (e) {
    console.warn('Invalid date format:', dateStr)
    return new Date(0)
  }
}

// 修改文档排序逻辑
const sortedDocs = computed(() => {
  let docs = [...filteredDocs.value]

  if (sortType.value === 'newest') {
    docs.sort((a, b) => {
      if (a.sticky !== b.sticky) return b.sticky - a.sticky
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)
      if (dateA.getTime() === dateB.getTime()) {
        return a.title.localeCompare(b.title, 'zh-CN')
      }
      return dateB.getTime() - dateA.getTime()
    })
  } else {
    docs.sort((a, b) => {
      if (a.sticky !== b.sticky) return b.sticky - a.sticky
      if (a.category !== b.category) {
        return a.category?.localeCompare(b.category, 'zh-CN') || 0
      }
      return a.title.localeCompare(b.title, 'zh-CN')
    })
  }

  return docs
})

// 置顶文档
const stickyDocs = computed(() => {
  return sortedDocs.value.filter(doc => doc.sticky)
})

// 普通文档（非置顶）
const normalDocs = computed(() => {
  return sortedDocs.value.filter(doc => !doc.sticky)
})

// 分页
const totalPages = computed(() =>
  Math.ceil(normalDocs.value.length / pageSize)
)

// 修改分页逻辑
const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sortedDocs.value.slice(start, end)
})

// 标签操作
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value = [tag] // 只选择当前标签
  }
  currentPage.value = 1 // 重置页码
}

// 分类选择逻辑
const toggleCategory = (category) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = null // 取消选择
  } else {
    selectedCategory.value = category // 选择新分类
  }
  currentPage.value = 1 // 重置页码
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

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  position: sticky;
  top: 0;
  background: var(--vp-c-bg);
  z-index: 10;
  padding: 10px 0;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.sort-buttons {
  display: flex;
  gap: 10px;
}

.sort-btn {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: var(--vp-c-bg-mute);
}

.sort-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.filters {
  margin-bottom: 30px;
}

.filter-section {
  margin: 20px 0;
}

.filter-section h3 {
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
  font-size: 1.1em;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
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
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
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

/* 横向滚动布局 */
.horizontal-scroll {
  display: flex;
  grid-template-columns: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  /* 为滚动条留出空间 */
  gap: 20px;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background: var(--vp-c-brand);
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-brand-dark);
}

/* 在横向滚动模式下的卡片样式 */
.horizontal-scroll .doc-card-wrapper {
  flex: 0 0 300px;
  /* 固定宽度 */
  scroll-snap-align: start;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0;
}

.tag-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  background: var(--vp-c-bg-mute);
}

.tag-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.categories-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0;
}

.category-btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.category-btn:hover {
  background: var(--vp-c-bg-mute);
}

.category-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

/* 调整筛选区域的间距 */
.filter-section+.filter-section {
  margin-top: 24px;
}

.date-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.year-filter,
.month-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.year-btn,
.month-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.year-btn {
  font-weight: 500;
}

.month-btn {
  padding: 2px 10px;
  font-size: 0.85em;
}

.year-btn:hover,
.month-btn:hover {
  background: var(--vp-c-bg-mute);
}

.year-btn.active,
.month-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

/* 筛选器标题样式 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
}

.toggle-icon {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.toggle-icon.is-open {
  transform: rotate(180deg);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 筛选器内容过渡 */
.filter-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-section {
    margin: 12px 0;
  }

  .filter-header {
    padding: 12px 0;
  }
}

.WebDocs {
  background-color: #42b983;
  color: #ffffff;
  transition: all 0.3s;
  cursor: pointer;
}

.WebDocs:hover {
  background-color: #5bac87;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
}
</style>
