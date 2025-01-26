// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import MyWebsite from './components/MyWebsite.vue'  // 简历组件
import animation from './components/animation.vue' // 视频组件
import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import GlobalToast from './components/GlobalToast.vue' // 全局提示组件
import card from './components/card.vue'

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
  }
}
