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
  }, {
    title: '网页模版',
    desc: '所有成功都始于模板',
    url: 'https://template0.com/',
  },{
    title: 'Github搜索',
    desc: '所有成功都始于模板',
    url: 'https://github.com/search',
  },{
    title: 'Github探索',
    desc: '兴趣推荐+每日热门',
    url: 'https://github.com/explore',
    badge: 'HOT',
    badgeType: 'hot'
  },{
    title: '在线代办清单',
    desc: '所有代办事项存储在本地',
    url: 'https://ricocc.com/todo/',
    badge: 'Github项目',
    badgeType: 'default'
  },{
    title: 'Simple Icons',
    desc: '流行品牌的 3270 SVG 图标',
    url: 'https://simpleicons.org/',
  },{
    title:'在线图标制作',
    desc:'一个直观的应用程序图标生成器，可让您自定义颜色、边框、阴影等，以轻松创建独特的应用程序图标。',
    url:'https://zhangyu1818.github.io/appicon-forge/'
  },{
    title:'Raphael AI',
    desc:'世界首个免费无限制AI图像生成器，几秒钟内创建令人惊叹的AI生成图像',
    url:'https://raphael.app/zh'
  },{
    title:'Reactbits',
    desc:'为创意开发人员精心挑选的动画组件集合',
    url:'https://www.reactbits.dev/'
  },{
    title:'FREEP!K',
    desc:'免费素材网站，包含原始格式',
    url:'https://www.freepik.com'
  },{
    title:'路过图床',
    desc:'免费图床',
    url:'https://imgse.com/',
    badge: 'BETA',
    badgeType: 'beta'
  },{
    title:'蓝奏云',
    desc:'来这里，下载不限速度，不限流量，不限次数，免登录下载！',
    url:'https://pc.woozooo.com/',
    badge: 'HOT',
    badgeType: 'hot'
  },{
    title:'极简插件',
    desc:'浏览器插件网站',
    url:'https://chrome.zzzmh.cn/'
  },{
    title:'UomgAPI',
    desc:'稳定、快速、免费的 API 接口服务共收录了 51 个接口项目',
    url:'https://api.uomg.com/'
  }



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
  {
    title: 'ES6 教程',
    desc: '《ECMAScript 6 教程》是一本开源的 JavaScript 语言教程',
    url: 'https://wangdoc.com/es6/'
  },{
    title:'JavaScript 教程',
    desc:'本教程全面介绍 JavaScript 核心语法，覆盖了 ES5 和 DOM 规范的所有内容。',
    url:'https://wangdoc.com/javascript/'
  },{
    title:'TypeScript 教程',
    desc:'TypeScript 开源教程，介绍基本概念和用法，面向初学者。',
    url:'https://wangdoc.com/typescript/'
  },{
    title:'Lodash',
    desc:'Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。',
    url:'https://www.lodashjs.com/'
  },{
    title:'课程笔记',
    desc:'尚硅谷系列课程笔记',
    url:'https://www.yuque.com/tianyu-coder/openshare/ccpa0mz1pq213lhw',
    badge: 'NEW',
    badgeType: 'new'
  },
  // {
  //   title:'',
  //   desc:'',
  //   url:''
  // }

]

</script>

## 常用工具

<Nav :tools="tools1"/>

## 学习资料

<Nav :tools="tools2"/>


## 补充 ↓
<Giscus/>