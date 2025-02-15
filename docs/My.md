---
title: 关于我
layout: doc
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import Nav from './.vitepress/theme/components/nav.vue'
import SkillTag from './.vitepress/theme/components/SkillTag.vue'
import TypeWriter from './.vitepress/theme/components/TypeWriter.vue'

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
    badgeType: 'beta',
    icon: 'https://api.iconify.design/logos:todoist.svg'
  },
  // {
  //   title: '项目模板',
  //   desc: 'Vue3 + TypeScript 项目模板',
  //   url: 'https://github.com/your-repo',
  //   badge: 'NEW',
  //   badgeType: 'new'
  // }
]

const profile = {
  name: 'Yu Meng',
  title: '鱼梦江湖',
  avatar: 'https://s21.ax1x.com/2025/02/07/pEm9bQO.jpg',
  bio: [
    '努力的意义就是，当好运来临的时候，我觉得我值得。           —— YuMeng',
    '成长是一场与自己的较量，你只需要比昨天的自己更好。',
    '路虽远，行则将至；事虽难，做则必成。'
  ],
  contacts: [
    {
      icon: 'github',
      name: 'GitHub',
      link: 'https://github.com/myfishdream'
    },
    {
      icon: 'email',
      name: 'Email',
      link: 'mailto:yumengjianghu@outlook.com'
    },
    // 图标由样式匹配，新增项需添加图标
  ]
}
</script>

<div class="profile-container">
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar-container">
        <img :src="profile.avatar" alt="头像" class="avatar">
      </div>
      <div class="profile-info">
        <h1 class="name">{{ profile.name }}</h1>
        <p class="title">{{ profile.title }}</p>
        <p class="bio">
        <!--:typeSpeed="80"
            :deleteSpeed="40"
            :delayBetween="2000" -->
          <TypeWriter 
            :texts="profile.bio"
            :typeSpeed="30"
            :deleteSpeed="30"
            :delayBetween="2000"
          />
        </p>
      </div>
    </div>
    <div class="contact-links">
      <a v-for="contact in profile.contacts" 
         :key="contact.link"
         :href="contact.link"
         class="contact-item"
         :class="contact.icon"
         target="_blank"
         rel="noopener">
        <span class="contact-name">{{ contact.name }}</span>
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
.profile-container {
  margin: 2rem 0;
}

.profile-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-brand);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 120%;
  height: 120%;
  object-fit: cover;
  object-position: center;
  transform-origin: center;
  transform: scale(1);
  transition: transform 0.3s ease;
}

.avatar-container:hover .avatar {
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.name {
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(120deg, var(--vp-c-brand), var(--vp-c-brand-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.title {
  margin: 0.5rem 0;
  font-size: 2rem;
  color: var(--vp-c-text-2);
  font-weight: 1000;
}

.bio {
  margin: 0.5rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.contact-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

.contact-item {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
}

.contact-item:hover {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}
/* 其他图标在此添加 */
.contact-item.github::before {
  content: '🐱';
  margin-right: 0.5rem;
}

.contact-item.email::before {
  content: '📧';
  margin-right: 0.5rem;
}
.contact-item.other::before {
  content: '📦';
  margin-right: 0.5rem;
}
/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .profile-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  
  .profile-card:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
  
  .avatar-container {
    border-width: 2px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .profile-card {
    padding: 1.5rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .avatar-container {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin: 0 auto;
  }
  
  .contact-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .name {
    font-size: 1.5rem;
  }
  
  .title {
    font-size: 1rem;
  }

  .avatar {
    width: 120%;
    height: 120%;
  }

  .bio {
    font-size: 0.9rem;
  }
}
</style>
