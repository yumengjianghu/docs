# 博客搭建

<a target="_blank" href="https://www.bilibili.com/video/BV1XW4y1w7bc?vd_source=3e46d32094b981673e11bfbadc3d8bf1">手把手教你使用vitepress搭建并部署一个自己的知识库（无需服务器）</a>

# 分享较大文件

如果你需要分享较大的文件或版本化的资源，可以使用 GitHub Releases：

1. 在仓库页面，点击 `Releases` -> `Create a new release`。
2. 填写版本号、标题和描述，然后上传文件到 `Attach binaries` 区域。
3. 发布后，文件的下载链接会显示在 Release 页面中，可以直接通过 `<a>` 标签链接下载。

**GitHub Releases** 是 GitHub 提供的一个功能，用于管理和分发软件的特定版本（如稳定版、测试版等）。它允许开发者将编译好的二进制文件、安装包、源代码打包文件等与版本号关联，并提供一个清晰的界面供用户下载和使用。

以下是 GitHub Releases 的原理和核心功能：

------

### **1. Releases 的核心概念**

- **版本号**：每个 Release 都与一个版本号（如 `v1.0.0`）关联，遵循语义化版本控制（Semantic Versioning）。
- **发布说明**：每个 Release 可以包含详细的发布说明（Release Notes），描述新功能、修复的 Bug 等。
- **附加文件**：开发者可以上传与版本相关的文件（如二进制文件、安装包、文档等），供用户下载。
- **Git 标签**：每个 Release 都基于一个 Git 标签（Tag），标签指向特定的提交（Commit），确保 Release 与代码的某个状态绑定。

------

### **2. Releases 的工作原理**

1. **创建标签**：

   - 开发者通过 Git 命令创建一个标签（Tag），并将其推送到 GitHub 仓库。

   - 例如：

     bash

     复制

     ```
     git tag v1.0.0
     git push origin v1.0.0
     ```

2. **创建 Release**：

   - 在 GitHub 仓库页面，点击 `Releases` -> `Draft a new release`。
   - 选择已有的标签或创建一个新标签。
   - 填写版本号、标题、发布说明，并上传附加文件（如二进制文件、安装包等）。

3. **发布 Release**：

   - 发布后，GitHub 会生成一个 Release 页面，显示版本号、发布说明和附加文件的下载链接。
   - 用户可以通过 Release 页面下载文件，或者通过 API 获取 Release 信息。

------

### **3. Releases 的优势**

- **版本管理**：清晰地管理软件的各个版本，方便用户下载特定版本。
- **附加文件支持**：可以直接上传二进制文件、安装包等，无需用户从源代码编译。
- **发布说明**：提供详细的版本更新信息，帮助用户了解新功能和修复内容。
- **API 支持**：GitHub 提供了 Releases API，开发者可以通过 API 自动化发布流程。

------

### **4. Releases 的使用场景**

- **分发二进制文件**：将编译好的可执行文件、安装包等与版本绑定，供用户直接下载。
- **软件更新**：通过 Releases 发布新版本，用户可以通过更新日志了解变化。
- **开源项目发布**：开源项目通常使用 Releases 来管理稳定版本和测试版本。
- **持续集成/持续交付（CI/CD）**：与 CI/CD 工具（如 GitHub Actions、Travis CI 等）集成，自动化发布流程。

------

### **5. Releases 的示例**

#### **创建 Release**

1. 在 GitHub 仓库页面，点击 `Releases` -> `Draft a new release`。
2. 填写版本号（如 `v1.0.0`）、标题和发布说明。
3. 上传附加文件（如 `app.zip`、`installer.exe` 等）。
4. 点击 `Publish release`。

#### **Release 页面**

发布后，Release 页面会显示以下内容：

- 版本号（如 `v1.0.0`）。
- 发布说明（Markdown 格式）。
- 附加文件的下载链接（如 `app.zip`、`installer.exe`）。

#### **下载链接示例**

用户可以通过以下链接下载文件：

复制

```
https://github.com/用户名/仓库名/releases/download/v1.0.0/app.zip
```

------

### **6. Releases 的 API**

GitHub 提供了 Releases API，开发者可以通过 API 自动化发布流程。以下是一些常用的 API 端点：

- **获取 Releases 列表**：

  复制

  ```
  GET /repos/{owner}/{repo}/releases
  ```

- **创建 Release**：

  复制

  ```
  POST /repos/{owner}/{repo}/releases
  ```

- **上传附加文件**：

  复制

  ```
  POST /repos/{owner}/{repo}/releases/{release_id}/assets
  ```

------

### **7. 注意事项**

- **文件大小限制**：单个文件不能超过 2 GB，每个 Release 的总文件大小不能超过 2 GB。
- **私有仓库**：私有仓库的 Releases 只能被授权用户访问。
- **标签管理**：确保标签与代码的提交状态一致，避免发布错误的版本。

------

通过 GitHub Releases，开发者可以更专业地管理软件版本，并方便地分发二进制文件和更新日志。