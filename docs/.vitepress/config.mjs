import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/docs/",
  head: [[
    "script",
    {
      async: true,
      src: "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
    },
  ], ["link", { rel: "icon", href: "文档.png" }]],
  title: "鱼梦江湖的技术栈",
  description: "知识文档",
  themeConfig: {
    logo: '/logo.png',
    sidebar: false, // 关闭侧边栏
    aside: 'left', // 设置右侧侧边栏在左侧显示
    outlineTitle: '目录',
    outline: 'deep',  // 根据h1 - h2 自动排版

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    nav: [
      {
        text: '前端', items: [
          { text: 'HTML5', link: '/word/h5/note' },
          { text: '布局技巧', link: '/word/CSS3/note' },
          { text: 'JavaScript', link: '/word/JS/Notes' },
          { text: 'TypeScript', link: '/word/TS/note' },
          { text: 'uniapp', link: '/word/uniapp/note' },
          {
            text: '框架', items: [
              { text: 'Vue3', link: '/word/vue3/note' },
              { text: 'Vue2', link: '/word/vue2/note' },
              { text: 'React', link: '/word/react/note' },
            ]
          },
        ]
      },
      {
        text: '后端', items: [
          { text: 'Nodejs', link: '/word/node/Node' },
          { text: 'Java', link: '/word/java/note' },
        ]
      },
      {
        text: '数据库', items: [
          { text: 'My SQL', link: '/word/mysql/note' },
          { text: 'SQL Server', link: '/word/sqlserver/note' },
          { text: 'MongoDB', link: '/word/mongodb/note' },

        ]
      },
      {
        text: '教程', items: [
          { text: 'VitePress博客搭建', link: '/word/VitePress博客搭建/note' },
          { text: 'Github Action部署', link: '/word/Github Action部署/note' },
          { text: 'VitePress插入个人网页', link: '/word/MyWebsiteTutorial/note' },
          { text: 'VitePress插入评论功能', link: '/word/CommentFunction/note' },
          { text: '局域网服务器部署', link: '/word/局域网服务器部署/note' },
          { text: 'Git基本使用', link: '/word/git/Git' },
          { text: 'Git/Github详解', link: '/word/Github/note' },
        ]
      },
      {
        text: '资源', items: [
          { text: 'Download 1', link: '/word/download1/note' },
          { text: 'Download 2', link: '/word/download2/note' },
        ]
      },
      {
        text: '其他', items: [
          { text: '我的简历', link: '/word/简历/docs.md' },
          { text: '视频模块', link: '/word/video/note.md' },
          { text: '实验功能', link: '/word/Experimental/note.md' },
          { text: '...', link: '/word/other/note' },
        ]
      }
    ],
    // sidebar: [
    //   {
    //     text: '目录',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yumengjianghu' },
      {
        icon: {
          svg: '<svg t="1735700599029" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3133" width="200" height="200"><path d="M998.4 352.256c-3.072-136.192-121.856-162.304-121.856-162.304s-92.672-0.512-212.992-1.536l87.552-84.48s13.824-17.408-9.728-36.864c-23.552-19.456-25.088-10.752-33.28-5.632-7.168 5.12-112.128 108.032-130.56 126.464-47.616 0-97.28-0.512-145.408-0.512h16.896S323.584 63.488 315.392 57.856s-9.216-13.824-33.28 5.632c-23.552 19.456-9.728 36.864-9.728 36.864l89.6 87.04c-97.28 0-181.248 0.512-220.16 2.048C15.872 225.792 25.6 352.256 25.6 352.256s1.536 271.36 0 408.576c13.824 137.216 119.296 159.232 119.296 159.232s41.984 1.024 73.216 1.024c3.072 8.704 5.632 51.712 53.76 51.712 47.616 0 53.76-51.712 53.76-51.712s350.72-1.536 379.904-1.536c1.536 14.848 8.704 54.272 56.832 53.76 47.616-1.024 51.2-56.832 51.2-56.832s16.384-1.536 65.024 0c113.664-20.992 120.32-154.112 120.32-154.112s-2.048-273.92-0.512-410.112z m-97.792 434.176c0 21.504-16.896 38.912-37.888 38.912h-691.2c-20.992 0-37.888-17.408-37.888-38.912V328.192c0-21.504 16.896-38.912 37.888-38.912h691.2c20.992 0 37.888 17.408 37.888 38.912v458.24z" fill="#1296DB" p-id="3134"></path><path d="M409.088 418.816l-203.264 38.912 17.408 76.288 201.216-38.912zM518.656 621.056c-49.664 106.496-94.208 26.112-94.208 26.112l-33.28 21.504s65.536 89.6 128 21.504c73.728 68.096 130.048-22.016 130.048-22.016l-30.208-19.456c0-0.512-52.736 75.776-100.352-27.648zM619.008 495.104l201.728 38.912 16.896-76.288-202.752-38.912z" fill="#1296DB" p-id="3135"></path></svg>'
        }, link: 'https://space.bilibili.com/1162766914'
      },
      {
        icon: {
          svg: '<svg t="1735727905242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14987" width="200" height="200"><path d="M517.632 563.2L0.0512 189.44V153.6h1024v43.6224L517.632 563.2zM267.2128 255.6928l250.368 181.0944L768 256H267.2128z" fill="#74BCFF" p-id="14988"></path><path d="M102.4 256v563.2h819.2V256H102.4M0 153.6h1024v768H0z" fill="#1990FF" p-id="14989"></path></svg>'
        },
        link: ' /docs/IDCard',
      },
    ],
    footer: {
      copyright: 'Website Based on Vitepress create and DIY<br/>© 鱼梦江湖 2025 MIT',
      message: '<span id="busuanzi_container_page_pv" data-page-id="age-01">本页访问量：<span id="busuanzi_value_page_pv"></span> 次</span>',
    }
  }
})
