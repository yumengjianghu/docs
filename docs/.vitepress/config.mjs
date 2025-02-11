import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // base: "/docs/",

  metaChunk: true, //当设置为 true 时，将页面元数据提取到单独的 JavaScript 块中，而不是内联在初始 HTML 中。这使每个页面的 HTML 负载更小，并使页面元数据可缓存，从而当站点中有很多页面时可以减少服务器带宽。
  markdown: {
    image: {
      lazyLoading: true
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    lineNumbers: true,
    frontmatter: true,
    toc: { level: [1, 2, 3] },
    config: (md) => {
      md.options.frontmatter = true
    },
    vite: {
      optimizeDeps: {
        exclude: ['vitepress']
      },
      server: {
        fs: {
          // 允许服务访问上级目录
          allow: ['..']
        }
      },
      plugins: [
        {
          name: 'markdown-frontmatter',
          transform(code, id) {
            if (id.endsWith('.md')) {
              const match = code.match(/^---\n([\s\S]*?)\n---/)
              if (match) {
                const frontmatter = match[1]
                return {
                  code: `${code}\nexport const frontmatter = \`${frontmatter}\``
                }
              }
            }
          }
        }
      ]
    }
  },
  // 重写内置组件
  // vite: {
  //   resolve: {
  //     alias: [
  //       {
  //         find: /^.*\/VPNavBar\.vue$/,
  //         replacement: fileURLToPath(
  //           new URL('./components/CustomNavBar.vue', import.meta.url)
  //         )
  //       }
  //     ]
  //   }
  // },
  lastUpdated: true,
  head: [
    [
      "script",
      {
        async: true,
        src: "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
      },
    ],
    ["link", { rel: "icon", href: "logo3.png" }],
    // [
    //   'link',
    //   { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }
    // ]
  ],
  title: "鱼梦江湖的技术栈",
  description: "知识文档",
  themeConfig: {
    // docFooter: {
    //   prev: '上一页',
    //   next: '下一页'
    // },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到暗色主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '顶部',
    // externalLinkIcon:true, // 外部链接旁显示外部链接图标
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },
    // editLink: {
    //   pattern: ({ filePath }) => {
    //     if (filePath.startsWith('packages/')) {
    //       return `https://github.com/myfishdream/docs/tree/main/docs/${filePath}`
    //     } else {
    //       return `https://github.com/myfishdream/docs/tree/main/docs/${filePath}`
    //     }
    //   },
    // },
    logo: '/logo3.png',
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
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者'
            },
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除'
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接'
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈'
            }
          },
        },
      },
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '分类', link: '/tag' },
      { text: '留言板', link: '/MessageBoards' },
      {
        text: '笔记', items: [
          {
            text: '前端', items: [
              { text: 'H5', link: '/pages/HTML5/note' },
              { text: 'JavaScript', link: '/pages/JavaScript/note' },
              { text: 'TypeScript', link: '/pages/TypeScript/note' },
              { text: 'Uniapp', link: '/pages/uniapp/note' },
            ],
          },
          {
            text: '框架', items: [
              { text: 'Vue3', link: '/pages/vue3/note' },
            ]
          },
          {
            text: '后端', items: [
              { text: 'Nodejs', link: '/pages/Node/note' },
              { text: 'Supabase快速入门', link: '/pages/Supabase/note' },

            ],
          },
        ]
      },
      {
        text: '教程', items: [
          { text: 'Github Action部署', link: '/pages/GithubActionTemplate/note' },
          { text: '局域网服务器部署', link: '/pages/LAN server deployment/note' },
          { text: 'Git基本使用', link: '/pages/Git/note' },
          { text: 'Git/Github详解', link: '/pages/Github+Git/note' },
          { text: 'Typora增强', link: '/pages/TyporaPlugin/note' },
          { text: '自定义Vitepress', link: '/pages/Custom-VitePress/note' },
          { text: '图标', link: '/pages/emoji/note' },
        ]
      },
      {
        text: '其他', items: [
          { text: '🛠工具', link: '/other/Download/note.md' },
          { text: '🧪实验功能', link: '/other/实验功能/note.md' },
          { text: '🖋文章创建', link: '/createdoc' }
          // {
          //   component: 'demo',
          //   // 可选的 props 传递给组件
          //   props: {
          //     title: 'My Custom Component'
          //   }
          // },
        ]
      }
      ,

    ],
    // sidebar: [
    //   {
    //     text: 'Section Title A',
    //     collapsed:true,
    //     items: [
    //       { text: 'Item A', link: '/item-a' },
    //       { text: 'Item B', link: '/item-b' },
    //     ]
    //   },
    //   {
    //     text: 'Section Title B',
    //     collapsed:true,
    //     items: [
    //       { text: 'Item C', link: '/item-c' },
    //       { text: 'Item D', link: '/item-d' },
    //     ]
    //   },
    //   {
    //     text: 'Level 1',
    //     collapsed:true,
    //     items: [
    //       {
    //         text: 'Level 2',
    //         items: [
    //           {
    //             text: 'Level 3',
    //             items: [

    //             ]
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yumengjianghu' },
      {
        icon: {
          svg: '<svg t="1735727905242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14987" width="200" height="200"><path d="M517.632 563.2L0.0512 189.44V153.6h1024v43.6224L517.632 563.2zM267.2128 255.6928l250.368 181.0944L768 256H267.2128z" fill="#74BCFF" p-id="14988"></path><path d="M102.4 256v563.2h819.2V256H102.4M0 153.6h1024v768H0z" fill="#1990FF" p-id="14989"></path></svg>'
        },
        link: ' /IDCard',
      },
    ],
    footer: {
      copyright: '<span id="busuanzi_container_page_pv" data-page-id="age-01">👀：<span id="busuanzi_value_page_pv"></span> 次</span>',
      message: '© 鱼梦江湖 2025 MIT',
    }
  }
})
