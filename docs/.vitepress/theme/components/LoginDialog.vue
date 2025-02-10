<template>
  <div class="login-dialog-overlay" @click.self="$emit('close')">
    <div class="login-dialog">
      <h3>管理员验证</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            autocomplete="off"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
          />
        </div>
        <div class="error-message" v-if="error">{{ error }}</div>
        <div class="remember-login">
          <label>
            <input 
              type="checkbox" 
              :checked="rememberLogin"
              @change="$emit('update:remember-login', $event.target.checked)"
            >
            下次发布文章时记住登录状态
          </label>
        </div>
        <div class="dialog-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">取消</button>
          <button type="submit" class="submit-btn" :disabled="isVerifying">
            <span v-if="isVerifying" class="loading-spinner"></span>
            <span>{{ isVerifying ? '验证中' : '确认' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import CryptoJS from 'crypto-js'

// 创建新的 Supabase 客户端实例
const supabase = createClient(
  'https://wyynppzrdxgjdtdrzdqu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eW5wcHpyZHhnamR0ZHJ6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMDYxMDAsImV4cCI6MjA1NDY4MjEwMH0.OEUVtD1N008Ld1X2usWkVbdCFJstXU2pTECrgi6ND0M'
)

const emit = defineEmits(['close', 'success', 'update:remember-login'])

const username = ref('')
const password = ref('')
const error = ref('')
const isVerifying = ref(false)

const handleSubmit = async () => {
  if (isVerifying.value) return
  error.value = ''
  
  try {
    isVerifying.value = true
    
    const hashedPassword = CryptoJS.SHA256(password.value).toString().toLowerCase()
    
    const { data, error: queryError } = await supabase
      .from('Manage')
      .select('*')
      .match({
        name: username.value,
        password: hashedPassword
      })
    
    if (queryError) throw queryError
    
    if (data && data.length > 0) {
      // 创建会话数据
      const sessionData = {
        user: data[0],
        access_token: CryptoJS.SHA256(Date.now().toString()).toString(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24小时后过期
      }
      
      emit('success', sessionData)
    } else {
      error.value = '用户名或密码错误'
    }
  } catch (err) {
    console.error('验证失败:', err)
    error.value = '验证失败，请重试'
  } finally {
    isVerifying.value = false
  }
}
</script>

<style scoped>
.login-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.login-dialog {
  background: var(--vp-c-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  animation: slideUp 0.3s ease-out;
}

.login-dialog h3 {
  margin: 0 0 1.5rem;
  color: var(--vp-c-text-1);
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 继承原有的按钮样式 */
.submit-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.remember-login {
  margin: 1rem 0;
  display: flex;
  align-items: center;
}

.remember-login label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.remember-login input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style> 