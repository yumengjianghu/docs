// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { MotionPlugin } from '@vueuse/motion'

import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import VueLazyloadNext  from 'vue-lazyload-next'   // 懒加载指令
import MouseEvent from './components/MouseEvent.vue' // 鼠标跟随特效
import ThemeSwitch from './components/ThemeSwitch.vue' // 主题切换过渡动画

// 引入懒加载图片
import loadingIMG from '../../src/status/xhj.gif'
import errorIMG from '../../src/status/loseimg.png'


import './style.css'
import './custom.css'

// /** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // ...
    })
  },
  Layout: ThemeSwitch,  // 浅暗切换动画
  
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('Giscus', Giscus);
    app.component('CopyBlock', CopyBlock);
    app.component('MouseEvent', MouseEvent);
    app.use(VueLazyloadNext, {
      loading: loadingIMG, // 加载占位图
      error: errorIMG,     // 错误占位图
      preLoad:1.3,          // 预加载高度比例
      attempt:3,             // 重试次数
    });
    app.use(MotionPlugin)
  }
}
