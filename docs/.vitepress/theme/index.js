// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { MotionPlugin } from '@vueuse/motion'

import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import Modal from './components/Modal.vue' // 模态框
import VueLazyloadNext  from 'vue-lazyload-next'   // 懒加载指令
import MouseEvent from './components/MouseEvent.vue' // 鼠标跟随特效
import bear from './components/bear.vue'  // 主页熊
import TimeLine from './components/TimeLine.vue' // 测试
// import ThemeSwitch from './components/ThemeSwitch.vue' // 主题切换过渡动画
import Classification from './components/classification.vue'
import DocCard from './components/DocCard.vue'
import createDocs from './components/createDocs.vue'
import getdocs from './components/getdocs.vue'
import MessageBoards from './components/MessageBoards.vue'

// 引入懒加载图片
import loadingIMG from '../../public/status/xhj.gif'
import errorIMG from '../../public/status/loseimg.png'


import './style.css'
import './custom.css'

// /** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 'doc-footer-before': () => h(Giscus), // 特点位置插入组件  
      'home-hero-image': () => h(bear), // 特点位置插入组件
    })
  },
  // Layout: ThemeSwitch,  // 浅暗切换动画
  
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('Giscus', Giscus);
    app.component('CopyBlock', CopyBlock);
    app.component('Modal', Modal)
    app.component('MouseEvent', MouseEvent);
    app.component('TimeLine', TimeLine);
    app.component('Classification', Classification);
    app.component('DocCard', DocCard);
    app.component('createDocs', createDocs);
    app.component('getdocs', getdocs);
    app.component('MessageBoards', MessageBoards);
    app.use(VueLazyloadNext, {
      loading: loadingIMG, // 加载占位图
      error: errorIMG,     // 错误占位图
      preLoad:1.3,          // 预加载高度比例
      attempt:3,             // 重试次数
    });
    app.use(MotionPlugin)
  }
}
