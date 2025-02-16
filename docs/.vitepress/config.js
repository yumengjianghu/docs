export default {
  // ... 其他配置
  
  vite: {
    build: {
      // 调整块大小警告限制
      chunkSizeWarningLimit: 1000,
      
      rollupOptions: {
        output: {
          // 手动分块策略
          manualChunks: {
            // 编辑器相关的库单独打包
            'editor': [
              '@tinymce/tinymce-vue',
              'quill',
              'turndown'
            ],
            // UI 组件相关的库单独打包
            'ui': [
              '@vueuse/motion',
              'vue-lazyload-next'
            ],
            // 数据库相关的库单独打包
            'db': [
              '@supabase/supabase-js'
            ]
          }
        }
      }
    },
    
    // 优化依赖预构建
    optimizeDeps: {
      include: [
        '@tinymce/tinymce-vue',
        'quill',
        'turndown',
        '@vueuse/motion',
        'vue-lazyload-next',
        '@supabase/supabase-js'
      ]
    }
  }
} 