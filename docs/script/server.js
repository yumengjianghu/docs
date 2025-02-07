const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process'); // 执行系统命令模块

const cors = require('cors')
app.use(cors())

// 颜色模块+清屏模块
const colors = require('ansi-colors');
const clear = require('clear')

// 基础路径配置
const BASE_PATH = 'F:/静态技术栈-Beta/Github-docs/docs';
const WORDS_DIR = path.join(BASE_PATH, 'word');
const TAGS_DIR = path.join(BASE_PATH, 'tags');
const AllDocuments_DIR = path.join(BASE_PATH, 'AllDocuments.md');
const TAG_DIR = path.join(BASE_PATH, 'tag.md');

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
// 创建文章主函数
async function main(articleName, tag, Overview, State) {
    let status = [];
    try {
        // const [articleName, tag, Overview, State] = process.argv.slice(2);

        if (!articleName || !tag) {
            return ('❌参数缺失！请按格式输入：node 脚本名 文章名 文档标签 文档概述(可选) 文档状态(可选)');
        }
        const overview = Overview ? Overview : "";
        const state = State ? State : "";
        // 创建文章目录
        const articleDir = path.join(WORDS_DIR, articleName);
        if (!fs.existsSync(articleDir)) {
            fs.mkdirSync(articleDir, { recursive: true });
            console.log(`✅ ${colors.green('成功创建目录：')}${articleDir}`);
            status.push('✅成功创建目录：', articleDir)
        }

        // 创建笔记文件
        const notePath = path.join(articleDir, 'note.md');
        if (!fs.existsSync(notePath)) {
            fs.writeFileSync(notePath, `# ${articleName}\n\n${overview}\n`);
            console.log(`📝 ${colors.green('已创建笔记文件：')}${notePath}`);
            status.push('📝已创建笔记文件：', notePath)

        }

        // 处理标签文件
        const tagFilePath = path.join(TAGS_DIR, `${tag}.md`);
        if (!fs.existsSync(tagFilePath)) {
            status.push(`❌ 标签文件 ${tag}.md 不存在!`)
            throw new Error(`❌ 标签文件 ${tag}.md ${colors.red('不存在！')}`);

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
            `\n<lazyshow>`,
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
        status.push('🏷️ 已更新 分类文档 标签文件：', tagFilePath)
        console.log(`🏷️ ${colors.green('已更新')} 分类文档 标签文件：${tagFilePath}`);
        // 追加到所有文档标签文件
        fs.appendFileSync(AllDocuments_DIR, recordData);
        fs.appendFileSync(TAG_DIR, recordData);
        status.push('🏷️ 已更新 所有文档 标签文件：', AllDocuments_DIR, '+', TAG_DIR)
        console.log(`🏷️ ${colors.green('已更新')} 所有文档 标签文件：${AllDocuments_DIR} + ${TAG_DIR}`);
        if (fs.existsSync(notePath)) {

            console.log(`⚡ ${colors.bgGreenBright('已自动打开笔记文件准备编辑')}`);
            status.push('⚡ 已自动打开笔记文件准备编辑')
            setTimeout(() => {
                openFile(notePath);
            }, 1000);
        }

    } catch (error) {
        console.error(error.message);
        status.push(error.message)
        process.exit(1);
    } finally {
        rl.close();
    }
    return status;
}

async function del(Title, Folder) {
    let status = [];
    const targetTitle = Title
    const targetFolder = Folder ? Folder : Title;
    // 定义需要操作的文件夹路径
    const docsPath = path.join('F:\\静态技术栈-Beta\\Github-docs\\docs');
    const tagsPath = path.join(docsPath, 'tags');
    const wordPath = path.join(docsPath, 'word');
    // 检查所有路径是否存在
    if (!fs.existsSync(docsPath)) {
        console.error(`${colors.red('错误：')}docs 文件夹不存在: ${docsPath}`);
        return `错误：docs 文件夹不存在: ${docsPath}`
        // process.exit(1);
    }

    if (!fs.existsSync(tagsPath)) {
        console.error(`${colors.red('错误：')}tags 文件夹不存在: ${tagsPath}`);
        return `错误：tags 文件夹不存在: ${tagsPath}`
        // process.exit(1);
    }

    if (!fs.existsSync(wordPath)) {
        console.error(`${colors.red('错误： ')}word 文件夹不存在:${wordPath}`);
        return `错误：word 文件夹不存在:${wordPath}`
        // process.exit(1);
    }
    // 构建正则表达式匹配目标代码块
    const regex = new RegExp(
        // 匹配 <lazyshow> 开始标签
        '<lazyshow>\\s*' +
        // 匹配 <column 标签且包含 title='目标标题'
        '<column[^>]*?\\btitle\\s*=\\s*[\'"]' + targetTitle + '[\'"][^>]*>' +
        // 匹配中间任意内容（非贪婪模式）
        '[\\s\\S]*?' +
        // 匹配 </column> 和 </lazyshow> 结束标签
        '</column>\\s*</lazyshow>',
        'g' // 全局匹配
    );
    // 遍历 docs 文件夹下的所有 .md 文件
    const deleteFromPath = (folderPath) => {
        fs.readdirSync(folderPath).forEach((file) => {
            if (file.endsWith('.md')) {
                const filePath = path.join(folderPath, file);
                let content = fs.readFileSync(filePath, 'utf-8');

                // 删除匹配的代码块
                const newContent = content.replace(regex, '');

                // 检查是否有变化并写入文件
                if (newContent !== content) {
                    fs.writeFileSync(filePath, newContent, 'utf-8');
                    console.log(`${colors.green('✔成功删除')},在文件 ${file} 中删除了标题为 "${targetTitle}" 的代码块`);
                    status.push(`✔ 成功删除,在文件${file}中删除了标题为${targetTitle}的代码块`)
                }
            }
        });
    };
    // 删除指定文件夹及其子文件
    const deleteFolder = (folderPath) => {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`${colors.green('✔成功删除')},删除了文件夹 ${folderPath} 及其子文件`);
            status.push(`✔ 成功删除,删除了文件夹${folderPath}及其子文件`)
        } else {
            console.error(`${colors.red('错误：')}文件夹不存在: ${folderPath}`);
            status.push('错误：文件夹不存在：', folderPath)
        }
    };
    deleteFromPath(docsPath);
    deleteFromPath(tagsPath);
    deleteFolder(path.join(wordPath, targetFolder));
    console.log('⚡ ' + colors.bgGreenBright('删除完成！'));
    status.push('⚡ 删除完成！')
    return status;
}
// clear();
// main();
// app.use(express.json)
app.use(express.urlencoded({ extended: false }))
// 配置解析表单数据的中间件
// 注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.post("/autoWrite", async function (req, res) {
    let { title, tag, overview, status } = req.body;
    try {
        const LOG = await main(title, tag, overview, status)
        res.send({
            操作数据: req.body,
            日志: LOG
        })
        console.log(LOG);
    } catch (error) {
        console.error("执行函数时出错:", error);
        res.status(500).send("内部服务器错误");
    }
})
app.post("/autoDelete", async function (req, res) {
    let { title, filename } = req.body
    try {
        const LOG = await del(title, filename)
        res.send({
            操作数据: req.body,
            日志: LOG
        })
    } catch (error) {
        console.error("执行函数时出错:", error);
        res.status(500).send("内部服务器错误");
    }


    // console.log(req.query);
    // res.send(req.query)
})
//req：请求对象，包含了与请求相关的属性和方法
//res：响应对象，包含了与响应相关的属性与方法
const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://192.168.31.9:${port}`)
})