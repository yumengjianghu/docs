## **使用自定义 Vue 组件嵌入网站**

创建一个自定义 Vue 组件来嵌入网站

### 实现步骤

#### **创建自定义组件**：

在 `.vitepress/theme/components` 目录下创建一个 Vue 组件文件，例如 `MyWebsite.vue`：

```vue
<template>
 
</template>

<script setup>

</script>

<style scoped>

</style>
```

#### **注册全局组件**：

在 `.vitepress/theme/index.js` 中注册组件：

```js
import MyWebsite from './components/MyWebsite.vue';

export default {
  enhanceApp({ app }) {
    app.component('MyWebsite', MyWebsite);
  },
};
```

#### **在 Markdown 文件中使用组件**：

在 `.md` 文件中引入并使用自定义组件：

```markdown
## 嵌入我的网站

以下是我的网站：

<MyWebsite />
```



**保存文件并启动 VitePress 服务器，访问页面即可看到嵌入的网站。**



### 其他方法

#### 动态JS

```markdown
## 动态嵌入我的网站

以下是我的网站：

<div id="website-container"></div>

<script>
const container = document.getElementById('website-container');
const iframe = document.createElement('iframe');

iframe.src = '你的网址';
iframe.width = '100%';
iframe.height = '500px';
iframe.style.border = '1px solid #ccc';

container.appendChild(iframe);
</script> 
```

#### iframe

```markdown
## 嵌入我的网站

以下是我的网站：

<iframe
  src="https://www.....com"
  width="100%"
  height="500px"
  style="border: 1px solid #ccc;"
></iframe>
```

## 评论
<Giscus />