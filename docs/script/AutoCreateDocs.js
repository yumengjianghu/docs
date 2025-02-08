const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process'); // 执行系统命令模块

// 颜色模块+清屏模块
const colors = require('ansi-colors');
const clear = require('clear')

// 基础路径配置
const BASE_PATH = 'F:/静态技术栈-Beta/Github-docs/docs';
const WORDS_DIR = path.join(BASE_PATH, 'pages');

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
// 核心修改：顶部插入内容的方法
function prependToFile(filePath, content) {
    try {
        // 读取原有内容
        const oldContent = fs.readFileSync(filePath, 'utf8');
        // 合并新内容到顶部
        const newContent = content + oldContent;
        // 重新写入文件
        fs.writeFileSync(filePath, newContent);
    } catch (error) {
        throw new Error(`❌ 文件写入失败：${filePath}\n${error.message}`);
    }
}

// 主函数
async function main() {
    try {
        // const [articleName, tag, Overview, State] = process.argv.slice(2);
        const [articleName, author] = process.argv.slice(2);

        if (!articleName || !tag) {
            throw new Error('参数缺失！请按格式输入：node 脚本名 文章名  作者');
        }
        // 4参数版
        // const overview = Overview ? Overview : "";
        // const state = State ? State : "";

        // 获取文档概述
        const overview = await new Promise(resolve => {
            rl.question('请输入文档概述：', answer => resolve(answer));
        });
        // 获取文档主题
        const category = await new Promise(resolve => {
            rl.question('请输入文档主题：', answer => resolve(answer));
        });
        // 获取文档状态
        const state = await new Promise(resolve => {
            rl.question('请输入文档标签：', answer => resolve(answer));
        });
        // 创建文章目录
        const articleDir = path.join(WORDS_DIR, articleName);
        if (!fs.existsSync(articleDir)) {
            fs.mkdirSync(articleDir, { recursive: true });
            console.log(`✅ ${colors.green('成功创建目录：')}${articleDir}`);
        }
        // 创建笔记文件
        const notePath = path.join(articleDir, 'note.md');
        if (!fs.existsSync(notePath)) {
            fs.writeFileSync(notePath, `# ${articleName}\n\n${overview}\n`);
            console.log(`📝 ${colors.green('已创建笔记文件：')}${notePath}`);
        }
        // 获取当前时间
        const now = new Date();
        // 格式化时间
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 月份从 0 开始，需要加 1
        const day = now.getDate();
        // 拼接成目标格式
        const formattedTime = `${year}-${month}-${day}`;

        // 构建结构化数据
        const recordData = [
            `---`,
            `title: ${articleName}`,
            `date: '${formattedTime}'`,
            `author: ${author}`,
            `                           `,
            `category:  ${category}`,
            `tags: ${state}`,
            `description: ${overview}`,
            `---`
        ].join('\n');

        // 追加到分类标签文件
        // fs.appendFileSync(tagFilePath, recordData);
        prependToFile(WORDS_DIR, recordData);
        console.log(`🏷️ ${colors.green('已添加frontmatter')}文件：${WORDS_DIR}`);
        // 追加到所有文档标签文件
        // fs.appendFileSync(AllDocuments_DIR, recordData);
        // fs.appendFileSync(TAG_DIR, recordData);
        if (fs.existsSync(notePath)) {
            openFile(notePath);
            console.log(`⚡ ${colors.bgGreenBright('已自动打开笔记文件准备编辑')}`);
        }

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}
clear();
main();
