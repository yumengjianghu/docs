// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import MyWebsite from './components/MyWebsite.vue'  // 简历组件
import animation from './components/animation.vue' // 视频组件
import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import GlobalToast from './components/GlobalToast.vue' // 全局提示组件
import card from './components/card.vue' // 名片
import prompt from './components/prompt.vue'  // 横幅提示
import MindMap from './components/MindMap.vue'  // 思维导图
import Experimental from './components/Experimental.vue'  // 实验功能模块
import VueLazyloadNext  from 'vue-lazyload-next'   // 懒加载指令
import ToDos from './components/ToDos.vue'  // 代办组件
import column from './components/column.vue'  // 记录栏


// 引入懒加载图片
import loadingIMG from '../../public/status/xhj.gif'
import errorIMG from '../../public/status/loseimg.png'

import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('MyWebsite', MyWebsite);
    app.component('animation', animation);
    app.component('Giscus', Giscus);
    app.component('CopyBlock', CopyBlock);
    app.component('GlobalToast', GlobalToast);
    app.component('card', card);
    app.component('prompt', prompt);
    app.component('MindMap', MindMap);
    app.component('Experimental', Experimental);
    app.component('ToDos', ToDos);
    app.component('column', column);
    app.use(VueLazyloadNext, {
      loading: loadingIMG, // 加载占位图
      error: errorIMG,     // 错误占位图
      preLoad:1.3,          // 预加载高度比例
      attempt:3,             // 重试次数
    });
  }
}
