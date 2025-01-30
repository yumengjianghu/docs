# 评论功能

基于vitepress搭建的博客添加一个评论功能

**Giscus** 是一个基于 **GitHub Discussions** 的评论系统，适合技术博客或个人网站。它将评论与 GitHub Discussions 绑定，用户可以通过 GitHub 账号登录并发表评论。以下是具体的使用步骤：

##  **准备工作**

**确保 GitHub 仓库已启用 Discussions**

1. 打开你的 GitHub 仓库。
2. 点击顶部菜单的 `Settings`。
3. 在左侧菜单中找到 `General`，向下滚动到 `Features` 部分。
4. 勾选 `Discussions`，启用 Discussions 功能。

<img v-lazy="'./assets/image-20250125125042756.png'" alt="image-20250125125042756" />

<img v-lazy="'./assets/image-20250125125109629.png'" alt="image-20250125125109629" />

 **安装 Giscus App**

1. 访问 [Giscus App](https://github.com/apps/giscus)。
2. 点击 `Install`，选择你的 GitHub 仓库并授权。

## **配置 Giscus**

**获取 Giscus 配置**

1. 访问 [Giscus 官网](https://giscus.app/)。
2. 填写以下信息：
   - **Repository**: 你的 GitHub 仓库（格式：`用户名/仓库名`）。
   - **Discussion Category**: 选择一个 Discussions 分类（如果没有，可以在 GitHub 仓库中创建）。
   - **Mapping**: 选择 `pathname`，确保每篇文章的评论独立。
   - **Theme**: 选择评论框的主题（如 `light`、`dark` 等）。
3. 填写完成后，Giscus 会生成一段 **JavaScript** 代码。

## **在 VitePress 中集成 Giscus**

**创建 Giscus 组件**

1. 在 VitePress 项目的 `docs/.vitepress/theme/components` 目录下，创建一个 `Giscus.vue` 文件。

2. 将 Giscus 生成的 **JavaScript** 代码转换为 **Vue** 组件。

   ```js
   <template>
     <div ref="giscus" class="giscus"></div>
   </template>
   
   <script>
   export default {
     mounted() {
       const script = document.createElement('script')
       script.src = 'https://giscus.app/client.js'
       script.setAttribute('data-repo', '你的GitHub用户名/你的仓库名')
       script.setAttribute('data-repo-id', '你的仓库ID')
       script.setAttribute('data-category', '你的分类名')
       script.setAttribute('data-category-id', '你的分类ID')
       script.setAttribute('data-mapping', 'pathname')
       script.setAttribute('data-reactions-enabled', '1')
       script.setAttribute('data-theme', 'light')
       script.setAttribute('crossorigin', 'anonymous')
       script.async = true
       this.$refs.giscus.appendChild(script)
     }
   }
   </script>
   ```

   > **注意**：
   >
   > - `data-repo` 是你的 GitHub 仓库（格式：`用户名/仓库名`）。
   > - `data-repo-id` 和 `data-category-id` 可以通过 GitHub API 获取，或者直接从 Giscus 官网生成的代码中复制。

**注册 Giscus 组件**

1. 在 `docs/.vitepress/theme/index.ts` 或 `docs/.vitepress/theme/index.js` 中注册 Giscus 组件。

   ```js
   import DefaultTheme from 'vitepress/theme'
   import Giscus from './components/Giscus.vue'
   
   export default {
     ...DefaultTheme,
     enhanceApp({ app }) {
       app.component('Giscus', Giscus)
     }
   }
   ```

## **在 Markdown 文件中使用 Giscus**

1. 在需要添加评论的 Markdown 文件中，插入 Giscus 组件。

   ```markdown
   ## 评论
   
   <Giscus />
   ```

2. 保存文件并启动 VitePress 开发服务器：

   ```bash
   npm run docs:dev
   ```

3. 打开浏览器，访问页面，即可看到 Giscus 评论框。





## 删除评论

 **删除单条评论**

1.**进入 GitHub Discussions**：

- 打开你的 GitHub 仓库。
- 点击顶部菜单的 `Discussions`，找到与评论相关的 Discussion。

2.**找到评论**：

- 在 Discussion 中，找到需要删除的评论。

3.**删除评论**：

- 点击评论右上角的 `···` 按钮。
- 选择 `Delete comment`。
- 确认删除。

 **删除整个 Discussion（删除所有评论）**

如果某个页面的评论不再需要，可以直接删除整个 Discussion。

1. **进入 GitHub Discussions**：
   - 打开你的 GitHub 仓库。
   - 点击顶部菜单的 `Discussions`，找到需要删除的 Discussion。
2. **删除 Discussion**：
   - 点击 Discussion 右上角的 `···` 按钮。
   - 选择 `Delete discussion`。
   - 确认删除。

## **自定义 Giscus**

### **修改主题**

Giscus 支持多种主题，可以在 `Giscus.vue` 中修改 `data-theme` 属性。

### **支持多语言**

Giscus 支持多语言，可以通过 `data-lang` 属性设置语言。	

## **注意事项**

- **仓库公开性**：如果仓库是私有的，评论功能将无法使用。确保仓库是公开的。
- **Discussions 分类**：确保 Discussions 分类已正确设置，否则评论无法显示。
- **缓存问题**：如果修改了 Giscus 配置但未生效，尝试清除浏览器缓存。

## 评论
<Giscus />