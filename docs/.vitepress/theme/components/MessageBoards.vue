<template>
  <div class="message-boards">
    <!-- 添加顶部通知 -->
    <transition name="notification">
      <div 
        v-if="notification.show" 
        class="notification-top"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </transition>

    <!-- 移除整体加载遮罩，只保留评论加载动画 -->
    <div class="message-header-section">
      <h2 class="title" v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }">📋留言板</h2>
      <p class="subtitle" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, delay: 200 }">
        在这里留下你的想法和建议...
      </p>
    </div>

    <!-- 修改留言表单部分 -->
    <div class="message-form-panel" :class="{ 'is-collapsed': isCollapsed }">
      <div class="panel-header" @click="togglePanel">
        <h3 class="panel-title">
          <span class="panel-icon">✍️</span>
          写留言
        </h3>
        <span class="collapse-icon">{{ isCollapsed ? '展开' : '收起' }}</span>
      </div>
      
      <div class="panel-content" v-show="!isCollapsed">
        <div class="message-form">
          <!-- 头像和输入框一行 -->
          <div class="form-main">
            <div class="avatar-section">
              <div class="avatar-upload" :class="{ 'is-anonymous': isAnonymous }">
                <img 
                  :src="avatarPreview || defaultAvatar" 
                  alt="头像"
                  class="avatar-preview"
                >
                <div 
                  class="avatar-overlay" 
                  v-if="!isAnonymous"
                  @click.stop="triggerAvatarUpload"
                >
                  <span class="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </span>
                  <span class="upload-text">更换头像</span>
                </div>
              </div>
              <input
                type="file"
                ref="avatarInput"
                @change="handleAvatarChange"
                accept="image/*"
                class="avatar-input"
                style="display: none;"
              >
            </div>

            <div class="content-wrapper">
              <textarea
                v-model="content"
                placeholder="说点什么吧"
                class="content-input"
                :class="{ 'has-content': content.length > 0 }"
                @input="adjustHeight"
                ref="contentInput"
              ></textarea>
            </div>
          </div>

          <!-- 底部控制栏一行 -->
          <div class="form-footer">
            <div class="left-controls">
              <div class="identity-switch">
                <button 
                  class="identity-btn" 
                  :class="{ active: !isAnonymous }"
                  @click="setIdentity(false)"
                >
                  <span class="identity-icon">👤</span>
                  实名
                </button>
                <button 
                  class="identity-btn" 
                  :class="{ active: isAnonymous }"
                  @click="setIdentity(true)"
                >
                  <span class="identity-icon">🎭</span>
                  匿名
                </button>
              </div>
              <input
                v-if="!isAnonymous"
                type="text"
                v-model="author"
                placeholder="你的名字"
                class="author-input"
              >
            </div>
            
            <div class="right-controls">
              <span class="char-count" :class="{ 'near-limit': content.length > 450 }">
                {{ content.length }}/500
              </span>
              <button 
                @click="submitMessage" 
                class="submit-btn"
                :disabled="isSubmitting || !content.trim()"
              >
                <span v-if="isSubmitting" class="loading-spinner"></span>
                <span>{{ isSubmitting ? '发送中...' : '发送' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简化的排序选项 -->
    <div class="sort-bar">
      <button 
        class="sort-option" 
        :class="{ active: sortType === 'newest' }"
        @click="sortType = 'newest'"
      >
        最新
      </button>
      <span class="sort-divider">|</span>
      <button 
        class="sort-option" 
        :class="{ active: sortType === 'likes' }"
        @click="sortType = 'likes'"
      >
        最热
      </button>
    </div>

    <!-- 修改评论列表部分 -->
    <div class="messages-container">
      <div v-if="commentsLoading" class="comments-loading-container">
        <Loading />
      </div>
      
      <template v-else>
        <div v-if="messages.length === 0" class="no-messages">
          <div class="empty-state">
            <span class="empty-icon">
                <svg t="1739245724895" class="icon" viewBox="0 0 1034 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14133" width="32" height="32"><path d="M0 198.171106m101.870246-27.094154l541.367591-143.986074q101.870246-27.094154 128.9644 74.776091l143.986074 541.367592q27.094154 101.870246-74.776091 128.9644l-541.367592 143.986074q-101.870246 27.094154-128.9644-74.776092l-143.986074-541.367591q-27.094154-101.870246 74.776092-128.9644Z" fill="#0F62FE" p-id="14134"></path><path d="M263.529412 252.988235m150.588235 0l469.835294 0q150.588235 0 150.588235 150.588236l0 469.835294q0 150.588235-150.588235 150.588235l-469.835294 0q-150.588235 0-150.588235-150.588235l0-469.835294q0-150.588235 150.588235-150.588236Z" fill="#C1D0FF" fill-opacity=".4" p-id="14135"></path><path d="M428.653929 730.724894a15.061835 15.061835 0 0 0-4.460423 9.476518l-10.032188 118.016c-0.627953 7.3984 5.520565 13.601129 12.924988 13.031906l116.877553-8.964518a15.067859 15.067859 0 0 0 9.392188-4.263153l324.002635-317.744188c8.905788-8.735624 9.045835-23.036988 0.310212-31.942777l-93.137318-94.974494c-8.735624-8.907294-23.036988-9.045835-31.942776-0.311717l-49.329694 48.37647 63.332894 64.582777c8.574494 8.744659 8.437459 22.785506-0.3072 31.36-8.744659 8.576-22.784 8.438965-31.36-0.3072l-63.331388-64.581271-242.939483 238.245647z" fill="#FFFFFF" p-id="14136"></path></svg>
            </span>
            <p>还没有留言，来说点什么吧~</p>
          </div>
        </div>
        
        <div class="messages-list">
          <div 
            v-for="(message, index) in messages" 
            :key="message.id" 
            class="message-item"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, delay: index * 100 }"
          >
            <!-- 评论头部信息 -->
            <div class="message-header">
              <div class="message-author-info">
                <img :src="message.avatar" :alt="message.author" class="avatar">
                <div class="author-details">
                  <span class="author-name">{{ message.author }}</span>
                  <span class="message-time">{{ formatTime(message.created_at) }}</span>
                </div>
              </div>
              <div class="message-actions">
                <button 
                  v-if="canDelete(message)"
                  @click="deleteMessage(message)"
                  class="delete-btn"
                >
                  撤回
                </button>
                <button 
                  class="like-btn"
                  @click="toggleLike(message)"
                  :class="{ 'liked': message.isLiked }"
                >
                  <span class="like-icon">⚡</span>
                  <span class="like-count">{{ message.likes }}</span>
                </button>
              </div>
            </div>
            <!-- 评论主要内容 -->
            <div class="message-content-wrapper">
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div v-if="hasMore" class="load-more">
          <button 
            @click="loadMore" 
            class="load-more-btn"
            :disabled="commentsLoading"
          >
            {{ commentsLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </template>
    </div>

    <!-- 提示消息 -->
    <transition name="notification">
      <div 
        v-if="notification.show" 
        class="notification"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'
import Loading from './Loading.vue'

// 创建 Supabase 客户端
const supabase = createClient(
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

// 状态管理
const messages = ref([])
const content = ref('')
const author = ref('')
const isAnonymous = ref(true)
const isSubmitting = ref(false)
const loading = ref(true)
const hasMore = ref(true)
const page = ref(0)
const contentInput = ref(null)
const MESSAGES_PER_PAGE = 10

// 通知状态
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// 修改默认头像为更现代的设计
const defaultAvatar = `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" fill="#E2E8F0"/>
  <circle cx="100" cy="80" r="40" fill="#94A3B8"/>
  <path d="M160 160c0-33.137-26.863-60-60-60s-60 26.863-60 60" stroke="#94A3B8" stroke-width="12" stroke-linecap="round"/>
</svg>
`)}`
const avatarPreview = ref('')
const avatarInput = ref(null)

// 添加新的加载状态
const commentsLoading = ref(false)

// 添加折叠状态管理
const isCollapsed = ref(true)

// 添加排序状态
const sortType = ref('newest')

// 显示通知
const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 触发文件选择
const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

// 图片处理函数
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_SIZE = 200 // 增加到 200px
        let width = img.width
        let height = img.height

        // 调整尺寸
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 提高图片质量
        const base64 = canvas.toDataURL('image/jpeg', 0.9)
        resolve(base64)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 修改头像处理函数
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showNotification('请选择图片文件', 'error')
    return
  }

  try {
    const processedImage = await processImage(file)
    avatarPreview.value = processedImage
    if (!isAnonymous.value) {
      localStorage.setItem('messageAvatar', processedImage)
    }
  } catch (error) {
    console.error('头像处理失败:', error)
    showNotification('头像处理失败，请重试', 'error')
  }
}

// 修改匿名切换处理
const handleAnonymousChange = () => {
  if (isAnonymous.value) {
    author.value = ''
    avatarPreview.value = ''
  } else {
    // 恢复保存的头像
    const savedAvatar = localStorage.getItem('messageAvatar')
    if (savedAvatar) {
      avatarPreview.value = savedAvatar
    }
  }
}

// 调整文本域高度
const adjustHeight = () => {
  const textarea = contentInput.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于30天
  if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)}天前`
  }
  
  return date.toLocaleDateString()
}

// 修改提交留言方法
const submitMessage = async () => {
  if (isSubmitting.value || !content.value.trim()) return
  
  isSubmitting.value = true

  try {
    const { data, error } = await supabase
      .from('message_boards')
      .insert([{
        content: content.value.trim(),
        author: isAnonymous.value ? '匿名用户' : (author.value || '匿名用户'),
        likes: 0,
        avatar: isAnonymous.value ? defaultAvatar : (avatarPreview.value || defaultAvatar)
      }])
      .select()

    if (error) throw error

    // 添加新消息到列表
    messages.value.unshift({
      ...data[0],
      isLiked: false
    })

    // 清空输入
    content.value = ''
    if (!isAnonymous.value) {
      localStorage.setItem('messageAuthor', author.value)
      if (avatarPreview.value) {
        localStorage.setItem('messageAvatar', avatarPreview.value)
      }
    }

    showNotification('留言发送成功！')
  } catch (error) {
    console.error('发送失败:', error)
    showNotification('发送失败，请重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 修改身份切换方法
const setIdentity = (anonymous) => {
  isAnonymous.value = anonymous
  handleAnonymousChange()
}

// 监听排序变化
watch(sortType, async () => {
  messages.value = []
  page.value = 0
  await loadMessages()
})

// 修改加载评论方法
const loadMessages = async () => {
  try {
    commentsLoading.value = true
    let query = supabase
      .from('message_boards')
      .select('*')
      .range(page.value * MESSAGES_PER_PAGE, (page.value + 1) * MESSAGES_PER_PAGE - 1)

    // 根据排序类型添加排序条件
    if (sortType.value === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sortType.value === 'likes') {
      query = query.order('likes', { ascending: false })
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    messages.value = [...messages.value, ...data]
    hasMore.value = data.length === MESSAGES_PER_PAGE
    page.value++
  } catch (error) {
    console.error('加载消息失败:', error)
    showNotification('加载失败，请重试', 'error')
  } finally {
    commentsLoading.value = false
  }
}

// 修改组件挂载时的加载逻辑
onMounted(async () => {
  try {
    commentsLoading.value = true
    
    // 恢复保存的作者信息
    const savedAuthor = localStorage.getItem('messageAuthor')
    const savedAvatar = localStorage.getItem('messageAvatar')
    if (savedAuthor) {
      author.value = savedAuthor
      isAnonymous.value = false
    }
    if (savedAvatar) {
      avatarPreview.value = savedAvatar
    }

    // 加载评论
    await loadMessages()
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    commentsLoading.value = false
  }
})

// 修改加载更多方法
const loadMore = async () => {
  if (commentsLoading.value) return
  
  // 记住当前滚动位置
  const scrollPosition = window.scrollY

  page.value++
  await loadMessages()

  // 恢复滚动位置
  nextTick(() => {
    window.scrollTo({
      top: scrollPosition,
      behavior: 'instant' // 使用 instant 避免平滑滚动
    })
  })
}

// 修改点赞功能
const toggleLike = async (message) => {
  // 立即更新UI
  message.isLiked = !message.isLiked
  message.likes = message.isLiked ? message.likes + 1 : message.likes - 1

  try {
    // 后台更新数据
    const { error } = await supabase
      .from('message_boards')
      .update({ likes: message.likes })
      .eq('id', message.id)

    if (error) {
      // 如果更新失败，回滚UI状态
      message.isLiked = !message.isLiked
      message.likes = message.isLiked ? message.likes + 1 : message.likes - 1
      throw error
    }
  } catch (error) {
    console.error('点赞失败:', error)
    showNotification('操作失败，请重试', 'error')
  }
}

// 移除不需要的加载状态相关代码
const loadMessageContent = async (index) => {
  const message = messages.value[index]
  if (!message || message.isLoaded) return
  
  messages.value[index] = {
    ...message,
    isLoaded: true
  }
}

// 检查是否可以删除消息
const canDelete = (message) => {
  const now = new Date()
  const messageTime = new Date(message.created_at)
  const diffInMinutes = (now - messageTime) / 1000 / 60
  return diffInMinutes <= 1
}

// 删除消息
const deleteMessage = async (message) => {
  if (!confirm('确定要删除这条留言吗？')) return

  try {
    const { error } = await supabase
      .from('message_boards')
      .delete()
      .eq('id', message.id)

    if (error) throw error

    // 从列表中移除消息
    messages.value = messages.value.filter(m => m.id !== message.id)
    showNotification('留言已删除', 'success')
  } catch (error) {
    console.error('删除失败:', error)
    showNotification('删除失败，请重试', 'error')
  }
}

const togglePanel = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
/* 恢复主容器原有宽度 */
.message-boards {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.message-header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

/* 修改留言表单样式 */
.message-form {
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.message-form:hover {
  transform: translateY(-2px);
}

.form-main {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
  width: 70px;
  height: 70px;
}

.avatar-upload {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.avatar-upload:hover .avatar-overlay {
  opacity: 1;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  gap: 4px;
}

.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-text {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  width: 100%;
  padding: 0 4px;
}

.avatar-upload.is-anonymous {
  cursor: not-allowed;
  opacity: 0.7;
}

.avatar-upload.is-anonymous:hover .avatar-overlay {
  opacity: 0;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
}

.content-input {
  width: 100%;
  min-height: 70px;
  padding: 0.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  resize: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: bold;
  line-height: 1.6;
}

.content-input:hover {
  border-color: var(--vp-c-brand-soft);
}

.content-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* 表单底部控制栏布局 */
.form-footer {
  display: flex;
  flex-direction: row; /* 电脑端保持水平布局 */
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.identity-switch {
  flex: 0 0 auto;
}

.author-input {
  width: 120px;
  min-width: 120px;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.author-input:hover {
  border-color: var(--vp-c-brand-soft);
}

.author-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.char-count {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.char-count.near-limit {
  color: var(--vp-c-danger);
  background: var(--vp-c-danger-soft);
}

.submit-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 90px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载更多按钮样式 */
.load-more {
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
}

.load-more-btn {
  padding: 0.75rem 2rem;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-brand-soft);
  border-radius: 8px;
  color: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 120px; /* 添加最小宽度 */
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.load-more-btn:not(:disabled):hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-boards {
    padding: 1rem;
  }

  .message-form {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .message-item {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .message-content-wrapper {
    padding: 0rem;
    margin-top: 0.75rem;
  }

  .title {
    font-size: 2rem; /* 调整移动端标题大小 */
  }

  .subtitle {
    font-size: 1rem;
  }

  /* 调整移动端头像大小 */
  .avatar-section {
    width: 50px;
    height: 50px;
  }

  /* 调整移动端输入框样式 */
  .content-input {
    padding: 1rem;
  }

  /* 调整移动端按钮样式 */
  .submit-btn,
  .load-more-btn {
    padding: 0.5rem 1.5rem;
  }

  /* 调整移动端身份切换按钮 */
  .identity-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  /* 调整移动端作者输入框 */
  .author-input {
    width: 120px;
  }

  /* 调整移动端加载容器 */
  .comments-loading-container {
    min-height: 150px;
    margin: 1rem 0;
  }

  .form-footer {
    flex-direction: column; /* 移动端改为列布局 */
    gap: 1rem;
  }

  .left-controls {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .right-controls {
    width: 100%;
    justify-content: space-between;
  }

  .upload-text {
    font-size: 10px; /* 移动端字体稍微小一点 */
    line-height: 1.2;
  }

  .avatar-overlay {
    padding: 4px; /* 移动端增加一点内边距 */
  }
}

/* 添加大屏幕样式 */
@media (min-width: 1200px) {
  .message-boards {
    padding: 3rem 2rem;
  }

  .message-form,
  .message-item {
    padding: 1rem; /* 减少 20% (从 2.5rem 减少到 2rem) */
  }
}

/* 新的身份切换按钮样式 */
.identity-switch {
  display: flex;
  gap: 0.5rem;
  background: var(--vp-c-bg);
  padding: 0.25rem;
  border-radius: 12px;
  border: 2px solid var(--vp-c-divider);
}

.identity-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.identity-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.identity-btn.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.identity-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.identity-btn:hover .identity-icon {
  transform: scale(1.1);
}

/* 修改消息加载样式 */
.message-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
  padding: 1rem;
}

/* 移除遮罩层相关样式 */
.loading-overlay {
  display: none;
}

/* 消息列表动画 */
.message-list-enter-active,
.message-list-leave-active {
  transition: all 0.5s ease;
}

.message-list-enter-from,
.message-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 懒加载样式 */
.message-item {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.message-item.lazy-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* 修改评论加载样式 */
.comments-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin: 2rem 0;
}

/* 修改评论容器样式，使其宽度大于留言板 */
.messages-container {
  width: 130%; /* 增加 30% 宽度 */
  margin-left: -15%; /* 向左偏移以保持居中 */
  box-sizing: border-box;
}

/* 移动端还原宽度 */
@media (max-width: 768px) {
  .messages-container {
    width: 100%;
    margin-left: 0;
  }
}

/* 修改顶部通知样式 */
.notification-top {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 0.95rem;
  min-width: 240px;
  border: 1px solid;
}

.notification-top::before {
  content: '';
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.notification-top.success {
  background: #F0FDF4;
  color: #15803D;
  border-color: #86EFAC;
}

.notification-top.success::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2315803D'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z'/%3E%3C/svg%3E");
}

.notification-top.error {
  background: #FEF2F2;
  color: #B91C1C;
  border-color: #FECACA;
}

.notification-top.error::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23B91C1C'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z'/%3E%3C/svg%3E");
}

/* 优化通知动画 */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
}

.notification-leave-active {
  transition: all 0.2s cubic-bezier(0.32, 0, 0.67, 0);
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translate(-50%, -30px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .notification-top {
    width: calc(100% - 32px);
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    min-width: auto;
  }
}

/* 删除按钮样式 */
.message-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: var(--vp-c-red-soft);
  border: 1px solid var(--vp-c-red);
  color: var(--vp-c-red);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 500;
}

.delete-btn:hover {
  background: var(--vp-c-red-soft);
  transform: translateY(-1px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .notification-top {
    width: 90%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .message-actions {
    gap: 0.5rem;
  }

  .delete-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* 折叠面板样式 */
.message-form-panel {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-form-panel:hover {
  border-color: var(--vp-c-brand-soft);
}

.panel-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
}

.panel-header:hover {
  background: var(--vp-c-bg-mute);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.panel-icon {
  font-size: 1.2rem;
}

.collapse-icon {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.panel-header:hover .collapse-icon {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.panel-content {
  padding: 0rem;
  border-top: 1px dashed var(--vp-c-divider);
}

/* 修改评论项样式 */
.message-item {
  background: var(--vp-c-bg);
  padding: 1.2rem 1.2rem 0rem 1.2rem;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-soft);
}

/* 作者信息区域 */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.message-author-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* 头像样式 */
.message-item .avatar {
  width: 60px;  /* 增大头像尺寸 */
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.message-item:hover .avatar {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 作者信息 */
.author-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.author-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 1rem;
}

.message-time {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* 留言内容区域 */
.message-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* 操作区域 */
.message-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
}

/* 点赞按钮 */
.like-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.like-btn.liked {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

/* 删除按钮 */
.delete-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-danger-soft);
  border-radius: 20px;
  background: transparent;
  color: var(--vp-c-danger);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: var(--vp-c-danger-soft);
  transform: translateY(-1px);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .message-item {
    background: var(--vp-c-bg-soft);
  }

  .message-content {
    background: var(--vp-c-bg-mute);
  }

  .like-btn,
  .delete-btn {
    background: var(--vp-c-bg-mute);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-item {
    padding: 1.2rem;
  }

  .message-content {
    padding: 0.9rem;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .like-btn,
  .delete-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  .author-name {
    font-size: 0.95rem;
  }

  .message-time {
    font-size: 0.75rem;
  }
}

/* 简化的排序栏样式 */
.sort-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0;
  font-size: 0.9rem;
}

.sort-option {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sort-option:hover {
  color: var(--vp-c-brand);
}

.sort-option.active {
  color: var(--vp-c-brand);
  font-weight: 600;
}

.sort-divider {
  color: var(--vp-c-divider);
  font-weight: 300;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sort-bar {
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .sort-option {
    font-size: 0.85rem;
  }
}

/* 表单底部控制栏布局 */
.form-footer {
  display: flex;
  flex-direction: row; /* 电脑端保持水平布局 */
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.left-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.identity-switch {
  flex: 0 0 auto;
}

.author-input {
  width: 120px; /* 固定适中的宽度 */
  min-width: 120px;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .form-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .left-controls {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .author-input {
    flex: 1;
    min-width: 150px;
    max-width: 100%;
    font-size: 0.85rem;
  }

  .right-controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .submit-btn {
    width: auto;
    min-width: 80px;
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .left-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .identity-switch {
    width: 100%;
    justify-content: center;
  }

  .author-input {
    width: 100%;
    text-align: center;
  }

  .right-controls {
    flex-direction: column;
    gap: 0.8rem;
    align-items: center;
  }

  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .char-count {
    width: 100%;
    text-align: center;
  }
}
</style>