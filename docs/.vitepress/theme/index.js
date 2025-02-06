// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import MyWebsite from './components/MyWebsite.vue'  // 简历组件
import Giscus from './components/Giscus.vue'       // 评论组件
import CopyBlock from './components/CopyBlock.vue' // 可复制模块
import GlobalToast from './components/GlobalToast.vue' // 全局提示组件
import prompt from './components/prompt.vue'  // 横幅提示
import Experimental from './components/Experimental.vue'  // 实验功能模块
import VueLazyloadNext  from 'vue-lazyload-next'   // 懒加载指令
import column from './components/column.vue'  // 记录栏
import lazyshow from './components/lazyshow.vue' // 懒显示
import MouseEvent from './components/MouseEvent.vue' // 鼠标跟随特效
import tag from './components/tag.vue'  // 标签
import toDo from './components/toDo.vue' // 复选框
import Like from './components/Like.vue'

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
    app.component('Giscus', Giscus);
    app.component('CopyBlock', CopyBlock);
    app.component('GlobalToast', GlobalToast);
    app.component('prompt', prompt);
    app.component('Experimental', Experimental);
    app.component('column', column);
    app.component('lazyshow', lazyshow);
    app.component('MouseEvent', MouseEvent);
    app.component('tag', tag);
    app.component('toDo', toDo);
    app.component('Like', Like);
    app.use(VueLazyloadNext, {
      loading: loadingIMG, // 加载占位图
      error: errorIMG,     // 错误占位图
      preLoad:1.3,          // 预加载高度比例
      attempt:3,             // 重试次数
    });
  }
}
