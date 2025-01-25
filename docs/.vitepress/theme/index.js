// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import MyWebsite from './components/MyWebsite.vue'  // 简历组件
import animation from './components/animation.vue' // 视频组件
import Giscus from './components/Giscus.vue'       // 评论组件

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
  }
}
