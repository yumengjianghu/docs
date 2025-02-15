---
title: 工具导航
layout: doc
---

<script setup>
import Nav from './.vitepress/theme/components/nav.vue'

const tools1 = [
  {
    title: '开发者武器库',
    desc: '涵盖多种工具',
    url: 'https://devtool.tech/',
  }, {
    title: 'excalidraw',
    desc: '在线手绘风流程图绘制',
    url: 'https://excalidraw.com/',
  }, {
    title: '文叔叔',
    desc: '在线快速分享文件',
    url: 'https://www.wenshushu.cn/',
  }, {
    title:'Carbon',
    desc:'代码图片生成',
    url:'https://carbon.now.sh/?bg=rgba%2874%2C144%2C226%2C1%29&t=material&wt=none&l=auto&width=680&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Fira+Code&fs=14px&lh=152%25&si=false&es=2x&wm=false'
  }, {
    title: '在线工具',
    desc: '在线代码压缩,二维码生成...',
    url: 'https://tool.lu/',
  },

]
const tools2 = [
  {
    title: 'MDN Web Docs',
    desc: '由 Mozilla 维护的开发者文档平台，专注于 Web 技术相关的文档和资源',
    url: 'https://developer.mozilla.org/zh-CN/'
  }, {
    title: '菜鸟教程',
    desc: '学的不仅是技术，更是梦想！',
    url: 'https://www.runoob.com/'
  }, 
  // {
  //   title: '',
  //   desc: '',
  //   url: ''
  // }, 

]
const tools3 =[
  {
    title:'',
    desc:'',
    url:'',
    badge: 'Default',
    badgeType: 'default'
  },
  {
    title: '',
    desc: '',
    url: '',
    badge: 'HOT',
    badgeType: 'hot'
  },
  {
    title:'',
    desc:'',
    url:'',
    badge: 'NEW',
    badgeType: 'new'
  },
  {
    title:'',
    desc:'',
    url:'',
    badge: 'BETA',
    badgeType: 'beta'
  }
]
</script>

## 常用工具

<Nav :tools="tools1"/>

## 学习资料

<Nav :tools="tools2"/>

## 标签测试

<Nav :tools="tools3"/>
