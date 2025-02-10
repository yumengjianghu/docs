<template>
    <div class="create-docs">
        <!-- 顶部通知 -->
        <div 
            v-if="notification.show" 
            class="notification"
            :class="notification.type"
        >
            {{ notification.message }}
        </div>

        <h1 class="page-title">创建文章</h1>
        <form @submit.prevent="submitArticle" class="create-form">
            <!-- 基本信息区域 -->
            <div class="form-basic-info">
                <div class="form-section-title">基本信息</div>
                <!-- 标题 -->
                <div class="form-group">
                    <label for="title">标题</label>
                    <input type="text" id="title" v-model="article.title" required />
                </div>

                <!-- 日期 -->
                <div class="form-group date-group">
                    <label for="date">创建日期</label>
                    <div class="date-input-group">
                        <input type="date" id="date" v-model="article.date" required />
                        <button type="button" @click="setCurrentDate" class="secondary-btn">
                            获取当前时间
                        </button>
                    </div>
                </div>

                <!-- 作者 -->
                <div class="form-group">
                    <label for="author">作者</label>
                    <input type="text" id="author" v-model="article.author" required />
                </div>

                <!-- 主题分类 -->
                <div class="form-group">
                    <label for="category">主题分类</label>
                    <input type="text" id="category" v-model="article.category" required />
                </div>

                <!-- 标签 -->
                <div class="form-group">
                    <label for="tags">标签（用逗号分隔）</label>
                    <input 
                        type="text" 
                        id="tags" 
                        v-model="article.tags" 
                        placeholder="例如: vue,javascript,web" 
                        required 
                    />
                </div>

                <!-- 描述 -->
                <div class="form-group">
                    <label for="description">描述</label>
                    <textarea 
                        id="description" 
                        v-model="article.description" 
                        rows="3"
                        required
                    ></textarea>
                </div>
            </div>

            <!-- 编辑器区域 -->
            <div class="editor-section">
                <div class="editor-header">
                    <div class="form-section-title">文章内容</div>
                    <button 
                        type="button" 
                        @click="toggleEditor"
                        class="switch-btn"
                    >
                        <span class="switch-icon">⚙️</span>
                        切换到 {{ currentEditor === 'quill' ? 'TinyMCE' : 'Quill' }} 编辑器
                    </button>
                </div>

                <!-- Quill 编辑器 -->
                <div v-if="currentEditor === 'quill'" class="editor-wrapper" ref="editorWrapper">
                    <div id="quill-editor"></div>
                    <div class="resize-handle" @mousedown="startResize"></div>
                </div>

                <!-- TinyMCE 编辑器 -->
                <div v-if="currentEditor === 'tinymce'" class="editor-wrapper">
                    <Editor
                        v-model="article.content"
                        :init="editorInit"
                        api-key="kbms3awifoa2yztv9jfaizumhd0glp4iikq19o7fliz8etr8"
                    />
                </div>
            </div>

            <!-- 提交按钮区域 -->
            <div class="form-actions">
                <button 
                    type="button" 
                    class="cancel-btn"
                    @click="resetForm"
                >
                    取消
                </button>
                <button 
                    type="submit" 
                    :disabled="isSubmitting"
                    class="submit-btn"
                >
                    <span v-if="isSubmitting" class="loading-spinner"></span>
                    <span>{{ isSubmitting ? '发布中' : '发布文章' }}</span>
                </button>
            </div>
        </form>

        <!-- 登录对话框 -->
        <login-dialog
            v-if="showLoginDialog"
            :supabase="supabase"
            @close="showLoginDialog = false"
            @success="handleLoginSuccess"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, shallowRef, nextTick, onUnmounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import Editor from '@tinymce/tinymce-vue'
import TurndownService from 'turndown'
import 'quill/dist/quill.snow.css'
import LoginDialog from './LoginDialog.vue'

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
})

turndownService.addRule('images', {
    filter: ['img'],
    replacement: function (content, node) {
        const alt = node.alt || ''
        const src = node.getAttribute('src') || ''
        return `![${alt}](${src})`
    }
})

const article = ref({
    title: '',
    author: '',
    date: '',
    category: '',
    tags: '',
    description: '',
    content: ''
})

// 使用 shallowRef 来存储编辑器实例
const quill = shallowRef(null)
const currentEditor = ref('quill')
const isSubmitting = ref(false)

// Supabase 配置
const supabase = createClient(
    'https://wyynppzrdxgjdtdrzdqu.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

// TinyMCE 配置
const editorInit = {
    height: 500,
    menubar: true,
    language: 'zh_CN',
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help',
    language_url: 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/zh_CN.js'
}

// 通知状态
const notification = ref({
    show: false,
    message: '',
    type: 'success'
})

// 显示通知
const showNotification = (message, type = 'success') => {
    notification.value = {
        show: true,
        message,
        type
    }
    
    // 3秒后自动关闭
    setTimeout(() => {
        notification.value.show = false
    }, 3000)
}

// 获取当前时间
const setCurrentDate = () => {
    const now = new Date()
    article.value.date = now.toISOString().split('T')[0]
}

// 修改初始化 Quill 编辑器方法
const initQuill = async () => {
  const { default: Quill } = await import('quill')
  
  // 注册自定义字号格式
  const Size = Quill.import('attributors/style/size')
  Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px']
  Quill.register(Size, true)

  quill.value = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: '请输入文章内容...',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'size': Size.whitelist }],  // 使用注册的字号列表
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: function() {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()

            input.onchange = async () => {
              const file = input.files[0]
              if (file) {
                try {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const range = this.quill.getSelection(true)
                    this.quill.insertEmbed(range.index, 'image', e.target.result)
                  }
                  reader.readAsDataURL(file)
                } catch (error) {
                  console.error('图片上传失败:', error)
                }
              }
            }
          }
        }
      }
    }
  })

  // 修改工具栏提示
  const tooltips = {
    'bold': '粗体',
    'italic': '斜体',
    'underline': '下划线',
    'strike': '删除线',
    'blockquote': '引用',
    'code-block': '代码块',
    'header': '标题',
    'list': '列表',
    'script': '上下标',
    'indent': '缩进',
    'size': '字号',
    'color': '文字颜色',
    'background': '背景颜色',
    'link': '链接',
    'image': '图片',
    'clean': '清除格式'
  }

  const toolbar = quill.value.getModule('toolbar')
  toolbar.container.querySelectorAll('button, .ql-picker').forEach(button => {
    const className = button.className
    const format = className.split('ql-')[1]
    if (tooltips[format]) {
      button.setAttribute('title', tooltips[format])
    }
  })

  // 监听内容变化，自动调整高度
  const adjustHeight = () => {
    const editorElement = document.querySelector('.ql-editor')
    if (editorElement) {
      editorElement.style.minHeight = '500px'
      editorElement.style.height = 'auto'
      editorElement.style.height = `${editorElement.scrollHeight}px`
    }
  }

  quill.value.on('text-change', () => {
    article.value.content = quill.value.root.innerHTML
    adjustHeight()
  })

  // 初始调整高度
  adjustHeight()
}

// 修改切换编辑器方法
const toggleEditor = async () => {
  if (currentEditor.value === 'quill') {
    article.value.content = quill.value?.root.innerHTML || ''
  }
  currentEditor.value = currentEditor.value === 'quill' ? 'tinymce' : 'quill'
  if (currentEditor.value === 'quill') {
    await nextTick()
    await initQuill()
  }
}

// 添加登录对话框状态
const showLoginDialog = ref(false)
const pendingArticleData = ref(null)

// 修改提交方法
const submitArticle = async () => {
    if (isSubmitting.value) return
    
    // 准备文章数据
    const articleData = {
        title: article.value.title,
        date: article.value.date,
        author: article.value.author,
        category: article.value.category,
        tags: JSON.stringify(article.value.tags.split(',').map(tag => tag.trim())),
        description: article.value.description,
        content: currentEditor.value === 'quill'
          ? quill.value?.root.innerHTML || ''  // 添加空值检查
          : article.value.content
    }
    
    // 保存待发布的文章数据
    pendingArticleData.value = articleData
    
    // 显示登录对话框
    showLoginDialog.value = true
}

// 登录成功后的处理
const handleLoginSuccess = async () => {
    if (!pendingArticleData.value) return
    
    try {
        isSubmitting.value = true
        
        // 确保保存完整的 HTML 内容
        const articleData = {
          ...pendingArticleData.value,
          content: currentEditor.value === 'quill'
            ? quill.value?.root.innerHTML || pendingArticleData.value.content
            : pendingArticleData.value.content
        }
        
        await supabase.from('articles').insert([articleData])
        
        showNotification('文章发布成功！')
        resetForm()
    } catch (error) {
        console.error('发布失败:', error)
        showNotification('发布失败，请重试', 'error')
    } finally {
        isSubmitting.value = false
        showLoginDialog.value = false
        pendingArticleData.value = null
    }
}

// 重置表单
const resetForm = () => {
    article.value = {
        title: '',
        author: '',
        date: '',
        category: '',
        tags: '',
        description: '',
        content: ''
    }
    
    if (currentEditor.value === 'quill' && quill.value) {
        quill.value.setText('')
    }
}

// 添加编辑器宽度调整相关的状态和方法
const editorWrapper = ref(null)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

// 开始调整大小
const startResize = (e) => {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = editorWrapper.value.offsetWidth

  // 添加事件监听器
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  
  // 添加调整时的样式
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

// 处理调整过程
const handleResize = (e) => {
  if (!isResizing.value) return
  
  const diff = e.clientX - startX.value
  const newWidth = Math.max(500, Math.min(startWidth.value + diff, window.innerWidth - 40))
  editorWrapper.value.style.width = `${newWidth}px`
}

// 停止调整
const stopResize = () => {
  isResizing.value = false
  
  // 移除事件监听器
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  
  // 恢复默认样式
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})

onMounted(async () => {
  if (currentEditor.value === 'quill') {
    await initQuill()
  }
})
</script>

<style scoped>
/* 页面布局 */
.create-docs {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.page-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin-bottom: 2rem;
    text-align: center;
}

.create-form {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

/* 区块标题 */
.form-section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vp-c-brand);
}

/* 基本信息区域 */
.form-basic-info {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    background: var(--vp-c-bg);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
}

/* 输入框样式 */
input[type="text"],
input[type="date"],
textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

input:focus,
textarea:focus {
    outline: none;
    border-color: var(--vp-c-brand);
    box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* 日期输入组 */
.date-input-group {
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* 编辑器区域 */
.editor-section {
    width: 90%;
    margin: 0 auto;
    background: var(--vp-c-bg);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 2rem;
    overflow: hidden;
}

.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.editor-wrapper {
    position: relative;
    width: 100%;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    overflow: visible;
    transition: width 0.1s ease;
}

/* 按钮样式 */
.switch-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.switch-btn:hover {
    background: var(--vp-c-bg-mute);
    transform: translateY(-1px);
}

.switch-icon {
    font-size: 1.2em;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding: 0 5%;
}

.submit-btn,
.cancel-btn {
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.submit-btn {
    background: var(--vp-c-brand);
    color: white;
    border: none;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.cancel-btn {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-divider);
}

.cancel-btn:hover {
    background: var(--vp-c-bg-mute);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .create-docs {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .create-form {
        gap: 2rem;
    }

    .form-basic-info,
    .editor-section {
        width: 100%;
        padding: 1rem;
    }

    .editor-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .switch-btn {
        width: 100%;
        justify-content: center;
    }

    .date-input-group {
        flex-direction: column;
    }

    .form-actions {
        flex-direction: column-reverse;
        padding: 0;
    }

    .submit-btn,
    .cancel-btn {
        width: 100%;
        padding: 1rem;
    }

    .resize-handle {
        display: none;
    }

    .editor-wrapper {
        width: 100% !important;
    }

    :deep(.ql-editor),
    :deep(.tox-tinymce) {
        min-height: 300px !important;
    }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
    .form-basic-info,
    .editor-section {
        background: var(--vp-c-bg-soft);
    }
}

/* 编辑器样式 */
.editor-wrapper {
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    overflow: hidden;
}

/* Quill 编辑器样式 */
:deep(.ql-container) {
    font-size: 16px;
    font-family: var(--vp-font-family-base);
}

:deep(.ql-editor) {
    min-height: 500px;
    padding: 20px;
    line-height: 1.7;
}

:deep(.ql-toolbar) {
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 12px;
}

:deep(.ql-toolbar button) {
    margin: 0 4px;
}

:deep(.ql-toolbar button:hover) {
    color: var(--vp-c-brand);
}

:deep(.ql-toolbar .ql-active) {
    color: var(--vp-c-brand);
}

:deep(.ql-formats) {
    margin-right: 12px;
}

/* TinyMCE 编辑器样式 */
:deep(.tox-tinymce) {
    min-height: 500px !important;
}

/* 顶部通知样式 */
.notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideDown 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.success {
    background-color: var(--vp-c-brand);
}

.notification.error {
    background-color: #dc3545;
}

@keyframes slideDown {
    from {
        transform: translate(-50%, -100%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, 0);
        opacity: 1;
    }
}

/* 加载动画 */
.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 修改提交按钮样式 */
.submit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
}

.submit-btn:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}

/* 增强编辑器样式 */
:deep(.ql-editor img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 4px;
}

:deep(.ql-color-picker), :deep(.ql-background) {
  .ql-picker-options {
    padding: 5px;
    width: 152px;
    
    .ql-picker-item {
      width: 16px;
      height: 16px;
      margin: 2px;
      border-radius: 2px;
    }
  }
}

:deep(.ql-picker.ql-color), :deep(.ql-picker.ql-background) {
  width: 40px;
}

/* 修改字号选择器样式 */
:deep(.ql-snow .ql-picker.ql-size) {
  width: 80px;
}

:deep(.ql-snow .ql-size .ql-picker-label::before),
:deep(.ql-snow .ql-size .ql-picker-item::before) {
  content: '默认';
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="12px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="12px"]::before) {
  content: '12px';
  font-size: 12px;
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="14px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="14px"]::before) {
  content: '14px';
  font-size: 14px;
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="16px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="16px"]::before) {
  content: '16px';
  font-size: 16px;
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="18px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="18px"]::before) {
  content: '18px';
  font-size: 18px;
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="20px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="20px"]::before) {
  content: '20px';
  font-size: 20px;
}

:deep(.ql-snow .ql-size .ql-picker-label[data-value="24px"]::before),
:deep(.ql-snow .ql-size .ql-picker-item[data-value="24px"]::before) {
  content: '24px';
  font-size: 24px;
}

/* 应用字号样式 */
:deep(.ql-editor) {
  [style*="font-size: 12px"] { font-size: 12px !important; }
  [style*="font-size: 14px"] { font-size: 14px !important; }
  [style*="font-size: 16px"] { font-size: 16px !important; }
  [style*="font-size: 18px"] { font-size: 18px !important; }
  [style*="font-size: 20px"] { font-size: 20px !important; }
  [style*="font-size: 24px"] { font-size: 24px !important; }
}

/* 优化下拉菜单样式 */
:deep(.ql-snow .ql-picker-options) {
  padding: 4px 0;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.ql-snow .ql-picker-item) {
  padding: 4px 8px;
  cursor: pointer;
}

:deep(.ql-snow .ql-picker-item:hover) {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

/* 调整手柄样式 */
.resize-handle {
  position: absolute;
  top: 0;
  right: -5px;
  width: 10px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
}

.resize-handle:hover::after,
.resize-handle:active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 4px;
  width: 2px;
  height: 100%;
  background-color: var(--vp-c-brand);
  opacity: 0.5;
}

.resize-handle:active::after {
  opacity: 1;
}
</style>