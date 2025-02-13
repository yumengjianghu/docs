---
# 文档基本信息
title: 自定义vitepress
date: 2025-2-7    # 创建日期，格式：YYYY-MM-DD
author: YuMeng    # 作者（可选）

# 分类和标签
category: 技术文档  # 主分类，只能有一个
tags: 
  - Vitepress   # 标签列表，可以有多个
  - 教程   
# 文档描述
description: 自定义vitepress的一些速记

# 额外信息（可选）
# image: /path/to/cover.jpg  # 封面图片
# sticky: 0                  # 置顶顺序，数字越大越靠前
# star: false  
---



# 自定义vitepress

详细记录如何深度自定义vitepress网站

## markDown扩展

```vue
```vue preview


```

```

```markdown
::: danger stop
危险区域
:::
```
::: danger
危险区域
:::

::: details 点击查看代码

```js{1,4}
console.log("Hello World!");
console.log("Hello World!");
console.log("Hello World!");
console.log("Hello World!");
console.log("Hello World!"); // [!code highlight]
```
:::

```js
console.log("Hello World!");
console.log("Hello World!");
console.log("Hello World!");// [!code focus:1]
console.log("Hello World!");
```

```js
console.log("Hello World!");
console.log("Hello World!");
console.log("移除");// [!code --]
console.log("添加");// [!code ++]

```


```js 
console.log("Hello World!");
console.log("Hello World!");
console.log("Hello World!"); // [!code error]
console.log("Hello World!"); // [!code warning]
```

```ts {1}
// 默认禁用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers {1}
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:line-numbers=2 {1}
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```
<<< @/script/AutoCreateDocs.js#snippet{1,2 js:line-numbers} [外部引入代码]

:::

引入外部md文档可选片段

<!--@include: ./out.md{9,10}-->

VitePress 使用 markdown-it 作为 Markdown 渲染器。上面提到的很多扩展功能都是通过自定义插件实现的。可以使用 .vitepress/config.js 中的 markdown 选项来进一步自定义 markdown-it 实例。


:tada: :100:

::: raw
Wraps in a `<div class="vp-raw">`
:::

## 资源处理

在 Markdown 使用 Vue

请注意，原始 HTML 在 Markdown 中也有效

```vue
<span v-for="i in 100">-{{ i }}</span>
```
<span v-for="i in 100">-{{ i }}</span>

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown 内容

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>

```

::: warning
避免在 Markdown 中使用 style scoped

在 Markdown 中使用时，style scoped 需要为当前页面的每个元素添加特殊属性，这将显著增加页面的大小。当我们需要局部范围的样式时 style module 是首选。
:::

 useData 辅助函数，它提供了当前页面的元数据：
<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<pre>{{ page }}</pre>


This <span v-pre>{{ will be displayed as-is }}</span>

布局插槽
默认主题的 `<Layout/>` 组件有一些插槽，能够被用来在页面的特定位置注入内容。

```js .vitepress/theme/MyLayout.vue
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: MyLayout
}
```

```vue
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #aside-outline-before>
      My custom sidebar top content
    </template>
  </Layout>
</template>
```

渲染函数

```js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import MyComponent from './MyComponent.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h(MyComponent)
    })
  }
}
```
全部可用插槽见官网https://vitepress.dev/zh/guide/extending-default-theme

doc-footer-before 页脚上（最后更新时间上）

doc-before 文档一级标题上

doc-after 页面底部左下

aside-top/bottom 侧栏顶/底部

home-hero-before 主页左侧上

home-hero-info-before 主页标题上

home-hero-info 取代主页标题

home-hero-info-after 副标题下

home-hero-actions-after 按钮下

home-hero-image 取代主页图片

home-hero-after 主页左侧中

当 layout: 'page' 在 frontmatter 中被启用时

page-top 

page-bottom
--------------------------------
nav-bar-title-befor 左上标题 前

nav-bar-title-after 后


## 重写内部组件

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPNavBar\.vue$/,
          replacement: fileURLToPath(
            new URL('./components/CustomNavBar.vue', import.meta.url)
          )
        }
      ]
    }
  }
})
```
想要了解组件的确切名称请参考VitePress官方的源代码。因为组件是内部的，因此在小版本更迭中，它们名字改动的可能性很小。
https://github.com/vuejs/vitepress/tree/main/src/client/theme-default/components

## 构建时数据加载

VitePress 提供了数据加载的功能，它允许加载任意数据并从页面或组件中导入它。数据加载只在构建时执行：最终的数据将被序列化为 JavaScript 包中的 JSON。

一个用于数据加载的文件必须以 .data.js 或 .data.ts 结尾。该文件应该提供一个默认导出的对象，该对象具有 load() 方法：

```js
export default {
  load() {
    return {
      hello: 'world'
    }
  }
}
```

然后，可以在 .md 页面和 .vue 组件中使用 data 具名导出从该文件中导入数据：

```vue
<script setup>
import { data } from './example.data.js'
</script>

<pre>{{ data }}</pre>
```
输出

```json
{
  "hello": "world"
}
```

即使它是异步的，这也是有效的：

```js
export default {
  async load() {
    // 获取远程数据
    return (await fetch('...')).json()
  }
}
```

如果正在使用或演示不支持 SSR 的组件 (例如，包含自定义指令)，则可以将它们包装在内置的 `<ClientOnly>` 组件中：


## frontmatter 配置

frontmatter 支持基于页面的配置。在每个 markdown 文件中，可以使用 frontmatter 配置来覆盖站点级别或主题级别的配置选项。此外，还有一些配置选项只能在 frontmatter 中定义。

示例用法：

```md
---
title: Docs with VitePress
editLink: true
---
```

可以通过 Vue 表达式中的 $frontmatter 全局变量访问 frontmatter 数据：

```md
{{ $frontmatter.title }}
```

### title: VitePress
title: VitePress
页面的标题。

### titleTemplate
标题的后缀

### description
页面描述

### head
指定要为当前页面注入的额外 head 标签。将附加在站点级配置注入的头部标签之后。

```yaml
---
head:
  - - meta
    - name: description
      content: hello
  - - meta
    - name: keywords
      content: super duper SEO
---
```

### layout
以下 frontmatter 选项仅在使用默认主题时适用。

layout

类型：doc | home | page

默认值：doc

指定页面的布局。

doc——它将默认文档样式应用于 markdown 内容。

home——“主页”的特殊布局。可以添加额外的选项，例如 hero 和 features，以快速创建漂亮的落地页。

page——表现类似于 doc，但它不对内容应用任何样式。**当想创建一个完全自定义的页面时很有用**。

layout: false
如果不想要任何布局，可以通过 frontmatter 传递 layout: false。如果想要一个完全可自定义的登录页面（默认情况下没有任何侧边栏、导航栏或页脚），此选项很有用。

```yaml
layout: doc
```

### navbar: false
顶部导航栏

### sidebar: false
侧边栏

### footer
页脚显示

### pageClass

将额外的类名称添加到特定页面。

```yaml
pageClass: custom-page-class
```
然后可以在 .vitepress/theme/custom.css 文件中自定义该特定页面的样式：

```css
.custom-page-class {
  /* 特定页面的样式 */
}
```

### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" />
### Title <Badge type="info">custom element</Badge>

自定义不同类型徽标的背景色

```css
:root {
  --vp-badge-info-border: transparent;
  --vp-badge-info-text: var(--vp-c-text-2);
  --vp-badge-info-bg: var(--vp-c-default-soft);

  --vp-badge-tip-border: transparent;
  --vp-badge-tip-text: var(--vp-c-brand-1);
  --vp-badge-tip-bg: var(--vp-c-brand-soft);

  --vp-badge-warning-border: transparent;
  --vp-badge-warning-text: var(--vp-c-warning-1);
  --vp-badge-warning-bg: var(--vp-c-warning-soft);

  --vp-badge-danger-border: transparent;
  --vp-badge-danger-text: var(--vp-c-danger-1);
  --vp-badge-danger-bg: var(--vp-c-danger-soft);
}
```