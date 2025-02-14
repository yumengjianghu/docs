---
title: 关于我
layout: doc
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import Nav from './.vitepress/theme/components/nav.vue'
import SkillTag from './.vitepress/theme/components/SkillTag.vue'

const skills = [
  {
    title: 'HTML',
    icon: 'https://api.iconify.design/logos:html-5.svg',
    color: '#E34F26'
  },
  {
    title: 'CSS',
    icon: 'https://api.iconify.design/logos:css-3.svg',
    color: '#1572B6'
  },
  {
    title: 'JavaScript',
    icon: 'https://api.iconify.design/logos:javascript.svg',
    color: '#F7DF1E'
  },
  {
    title: 'Vue',
    icon: 'https://api.iconify.design/logos:vue.svg',
    color: '#4FC08D'
  }
  ,
  {
    title: 'Git',
    icon: 'https://api.iconify.design/logos:git-icon.svg',
    color: '#dc4c31'
  },
  {
    title:'Github',
    icon:'https://api.iconify.design/logos:github-icon.svg',
    color:'#b7c2b7',
  },
  {
    title:'TypeScript',
    icon:'https://api.iconify.design/logos:typescript-icon.svg',
    color:'#3389fe',
  },
  {
    title:'Node.js',
    icon:'https://api.iconify.design/logos:nodejs-icon.svg',
    color:'#379337'
  },
  {
    title: 'Vite',
    icon:'https://api.iconify.design/logos:vitejs.svg',
    color:'#5e65e9'
  },
  {
    title:'Markdown',
    icon:'https://api.iconify.design/logos:markdown.svg',
    color:'#6e7681'
  },
  {
    title:'React',
    icon:'https://api.iconify.design/logos:react.svg',
    color:'#66d3f1'
  },
  {
    title:'Next.js',
    icon:'https://api.iconify.design/logos:nextjs-icon.svg',
    color:''
  },
  {
    title:'Ant Design',
    icon:'https://api.iconify.design/logos:ant-design.svg',
    color:'#176fe9'
  },
  {
    title:'Npm',
    icon:'https://api.iconify.design/logos:npm-icon.svg',
    color:'#c74342'
  },
  {
    title:'Pyhton',
    icon:'https://api.iconify.design/logos:python.svg',
    color:'#e0cb1d'
  }
]

const projects = [
  {
    title: '代办事项',
    desc: '基于Vue+TS的动态事件代办管理',
    url: 'https://github.com/your-repo',
    badge: 'Beta',
    badgeType: 'beta'
  },
  // {
  //   title: '项目模板',
  //   desc: 'Vue3 + TypeScript 项目模板',
  //   url: 'https://github.com/your-repo',
  //   badge: 'NEW',
  //   badgeType: 'new'
  // }
]
</script>

<div class="profile-header">
  <div class="avatar-wrapper">
    <img src="https://s21.ax1x.com/2025/02/07/pEm9bQO.jpg" alt="头像" class="avatar">
  </div>
  <div class="profile-info">
    <h1>Yu Meng</h1>
    <p class="title">鱼梦江湖</p>
    <p class="bio">热爱技术，专注于前端开发和全栈解决方案</p>
    <div class="social-links">
      <a href="https://github.com/myfishdream" target="_blank" class="social-link github">
        <span class="link-text">GitHub</span>
      </a>
      <a href="mailto:your@email.com" class="social-link email">
        <span class="link-text">Email</span>
      </a>
    </div>
    
  </div>
</div>

![Email](https://img.shields.io/badge/Email-yumengjianghu@outlook.com-blue?style=for-the-badge&logo=gmail&logoColor=white)

## 🎯 技能特长

<SkillTag :skills="skills"/>

## 💼 项目经历

<Nav :tools="projects"/>


<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  overflow: hidden;
  border: 4px solid var(--vp-c-brand);
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  transform: scale(1.2);
}

.avatar-wrapper:hover .avatar {
  transform: scale(1.3);
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
  background: linear-gradient(120deg, var(--vp-c-brand) 0%, var(--vp-c-brand-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
}

.bio {
  color: var(--vp-c-text-1);
  margin: 0.5rem 0;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  /* border-radius: 20px;  */
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
}

.social-link:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.link-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .social-link {
    background: var(--vp-c-bg-soft);
  }

  .avatar-wrapper {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-width: 3px;
  }
  
  .avatar-wrapper:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .social-links {
    justify-content: center;
  }

  .avatar-wrapper {
    width: 120px;
    height: 120px;
    border-radius: 60px;
  }
}
</style>
