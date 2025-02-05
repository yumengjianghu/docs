# 全自动文章创建

## 概述

只需要输入一串命令 在指定的文件夹内创建自定义名称文件夹及其子文件

创建完成后**自动**打开md编辑器(默认)

后跟标签，用于在对应的md文档写入代码块

- tag1
- tag2
- tag3
- tag4
- tag5
- tag6
- tag7

完整代码：

```js
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process'); // 执行系统命令模块

// 基础路径配置
const BASE_PATH = 'F:/静态技术栈-Beta/Github-docs/docs';
const WORDS_DIR = path.join(BASE_PATH, 'word');
const TAGS_DIR = path.join(BASE_PATH, 'tags');
const AllDocuments_DIR=path.join(BASE_PATH,'AllDocuments.md');
const TAG_DIR=path.join(BASE_PATH,'tag.md');


// 创建命令行接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 跨平台打开文件方法 
function openFile(filePath) {
    let command;
    switch (process.platform) {
        case 'darwin':  // macOS
            command = `open "${filePath}"`;
            break;
        case 'win32':   // Windows
            command = `start "" "${filePath}"`;
            break;
        default:        // Linux
            command = `xdg-open "${filePath}"`;
    }
    exec(command);
}

// 主函数
async function main() {
    try {
        const [articleName, tag] = process.argv.slice(2);

        if (!articleName || !tag) {
            throw new Error('参数缺失！请按格式输入：node 脚本名 文章名 文档标签');
        }

        // 获取文档概述
        const overview = await new Promise(resolve => {
            rl.question('请输入文档概述：', answer => resolve(answer));
        });
        // 获取文档状态
        const state = await new Promise(resolve => {
            rl.question('请输入文档状态：', answer => resolve(answer));
        });
        // 创建文章目录
        const articleDir = path.join(WORDS_DIR, articleName);
        if (!fs.existsSync(articleDir)) {
            fs.mkdirSync(articleDir, { recursive: true });
            console.log(`✅ 成功创建目录：${articleDir}`);
        }

        // 创建笔记文件
        const notePath = path.join(articleDir, 'note.md');
        if (!fs.existsSync(notePath)) {
            fs.writeFileSync(notePath, `# ${articleName}\n\n${overview}\n`);
            console.log(`📝 已创建笔记文件：${notePath}`);
        }

        // 处理标签文件
        const tagFilePath = path.join(TAGS_DIR, `${tag}.md`);
        if (!fs.existsSync(tagFilePath)) {
            throw new Error(`❌ 标签文件 ${tag}.md 不存在！`);
        }
        // 获取当前时间
        const now = new Date();

        // 格式化时间
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 月份从 0 开始，需要加 1
        const day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // 拼接成目标格式
        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // 标签颜色判定
        let tagColor = 'other'
        if (tag == 'tag1') tagColor = 'life'
        else if (tag == 'tag2') tagColor = 'note'
        else if (tag == 'tag3') tagColor = 'tutorial'
        else if (tag == 'tag4') tagColor = 'Web'
        else if (tag == 'tag5') tagColor = 'gush'
        else if (tag == 'tag6') tagColor = 'resource'
        else if (tag == 'tag7') tagColor = 'other'
        else console.log('无指定标签');
        // 构建结构化数据
        const recordData = [
            `<lazyshow>`,
            `  <column`,
            `    title='${articleName}'`,
            `    RecordTime='${formattedTime}'`,
            `    src='word/${articleName}/note'`,
            `    overview='${overview}'`,
            `    status='${state}'`,
            `    delay='1'`,
            `    TagColor='var(--tag-${tagColor}-color)'`,
            `  ></column>`,
            `</lazyshow>\n`
        ].join('\n');

        // 追加到分类标签文件
        fs.appendFileSync(tagFilePath, recordData);
        console.log(`🏷️ 已更新 分类文档 标签文件：${tagFilePath}`);
        // 追加到所有文档标签文件
        fs.appendFileSync(AllDocuments_DIR, recordData);
        fs.appendFileSync(TAG_DIR, recordData);
        console.log(`🏷️ 已更新 所有文档 标签文件：${AllDocuments_DIR} + ${TAG_DIR}`);
        if (fs.existsSync(notePath)) {
            openFile(notePath);
            console.log('🚀 已自动打开笔记文件准备编辑');
        }

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();

```

## 使用案例

```bash
node node .\AutomatedDocumentCreation.js 文章名称 文档标签
```

输入概述信息以及状态

![image-20250205141101753](./assets/image-20250205141101753.png)

## 撤回文档

一句命令，撤回所有执行的操作，用于上述脚本

```js
const fs = require('fs')
const path = require('path')

// 核心配置
const DOCS_ROOT = path.resolve('F:/静态技术栈-Beta/Github-docs/docs')
const ARTICLE_DIR = path.join(DOCS_ROOT, 'word')
const TAGS_DIR = path.join(DOCS_ROOT, 'tags')
const AllDocuments_DIR=path.join(DOCS_ROOT,'AllDocuments.md');
const TAG_DIR=path.join(DOCS_ROOT,'tag.md');

// 安全验证函数
const validatePathSafety = (targetPath, basePath) => {
  const relative = path.relative(basePath, targetPath)
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}

// 正则表达式构建器
const createBlockPattern = (articleName) => {
  const escapedName = articleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(
    `\\s*<lazyshow>[\\s\\S]*?\\bsrc=['"]word/${escapedName}/note['"][\\s\\S]*?</lazyshow>\\s*`,
    'g'
  )
}
// --------------------------------------------------------------------------------------------------------------------------

// 精准清理单个Markdown文件的关联代码块

function cleanSingleMDFile(filePath, articleName) {
  try {
    // === 安全验证 ===
    const resolvedPath = path.resolve(filePath)
    
    // 文件扩展名验证
    if (!resolvedPath.endsWith('.md')) {
      throw new Error('仅支持Markdown文件')
    }

    // 目录安全范围验证（根据需求调整）！！！
    const allowedPaths = [
      path.resolve(DOCS_ROOT)
      // 可添加其他允许路径
    ]
    if (!allowedPaths.some(p => resolvedPath.startsWith(p))) {
      throw new Error('文件路径超出允许范围')
    }

    // === 主处理逻辑 ===
    let content = fs.readFileSync(resolvedPath, 'utf8')
    const originalLineCount = content.split('\n').length
    let replacementCount = 0

    // 动态构建正则（复用核心逻辑）
    const safeName = articleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const blockPattern = new RegExp(
      `(<!--.*?-->\\s*)?` + 
      `<lazyshow>[\\s\\S]*?src=['"]\\s*word/${safeName}/note\\s*['"][\\s\\S]*?</lazyshow>`,
      'gi'
    )

    // 执行替换
    const newContent = content.replace(blockPattern, (match) => {
      replacementCount++
      console.log(`\n🗑️ 清理 ${path.basename(resolvedPath)} 匹配块：`)
      console.log('-'.repeat(40))
      console.log(match.trim().split('\n')[0] + '...') // 只显示首行避免刷屏
      console.log('-'.repeat(40))
      return ''
    })

    // 空白处理增强
    const cleanedContent = newContent
      .replace(/(\r\n|\r|\n){3,}/g, '\n\n')
      .replace(/^\s+$/gm, '')
      .trim() + '\n'

    // 内容变更判断
    if (cleanedContent !== content) {
      fs.writeFileSync(resolvedPath, cleanedContent)
      const newLineCount = cleanedContent.split('\n').length
      console.log(
        `✅ 更新完成：${path.basename(resolvedPath)}\n` +
        `   变更：${replacementCount}处替换 | ` +
        `行数变化：${originalLineCount} → ${newLineCount}`
      )
    } else {
      console.log(`ⓘ 无变更：${path.basename(resolvedPath)}`)
    }

  } catch (err) {
    console.error(`⚠️ 处理失败 ${path.basename(filePath)}：`, err.message)
  }
}


// --------------------------------------------------------------------------------------------------------------------------

// Markdown文件清理
const cleanMarkdownFiles = (articleName) => {
  const pattern = createBlockPattern(articleName)
  
  fs.readdirSync(TAGS_DIR)
    .filter(f => f.endsWith('.md'))
    .forEach(file => {
      const filePath = path.join(TAGS_DIR, file)
      const content = fs.readFileSync(filePath, 'utf8')
      
      // 执行安全替换
      const newContent = content
        .replace(pattern, '\n') // 替换为单个换行符
        .replace(/\n{3,}/g, '\n\n') // 清理多余空行
        .trim()

      // 只在有改动时写入文件
      if (newContent !== content.trim()) {
        fs.writeFileSync(filePath, newContent + '\n') // 保留末尾换行
        console.log(`✅ 清理标签文件：${file}`)
      }
    })
}

// 主逻辑
function removeArticle(articleName) {
  // ====== 路径安全检查 ======
  const targetDir = path.join(ARTICLE_DIR, articleName)
  if (!validatePathSafety(targetDir, ARTICLE_DIR)) {
    throw new Error(`危险路径：${targetDir}`)
  }

  // ====== 删除文章目录 ======
  if (fs.existsSync(targetDir)) {
    console.log(`🗑 正在删除文章目录：${articleName}`)
    fs.rmSync(targetDir, { recursive: true, force: true })
    console.log('✅ 目录删除完成')
  } else {
    console.log('ⓘ 目标目录不存在')
  }

  // ====== 清理标签引用 ======
  console.log('\n🔍 开始清理标签文件关联内容...')
  cleanMarkdownFiles(articleName)
  console.log('✅ 所有Tag文件清理操作完成')
  cleanSingleMDFile(AllDocuments_DIR,articleName)
  cleanSingleMDFile(TAG_DIR,articleName)
}

/* 使用示例：
* node script.js "文章名称"
*/
const articleName = process.argv[2]
if (!articleName) {
  console.log('请提供文章名称作为参数')
  process.exit(1)
}

removeArticle(articleName)

```

## 使用

```
node .\AutomaticallyDeleteDocuments.js 文档名称
```

