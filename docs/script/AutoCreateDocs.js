const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process'); // 执行系统命令模块

// 颜色模块+清屏模块
const colors = require('ansi-colors');
const clear = require('clear')

// 基础路径配置
const BASE_PATH = 'F:/静态技术栈-Beta/Github-docs/docs';
const WORDS_DIR = path.join(BASE_PATH, 'word');
const TAGS_DIR = path.join(BASE_PATH, 'tags');
const AllDocuments_DIR = path.join(BASE_PATH, 'recycleBin/AllDocuments.md');
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

// 主函数
async function main() {
    try {
        // const [articleName, tag, Overview, State] = process.argv.slice(2);
        const [articleName, tag] = process.argv.slice(2);

        if (!articleName || !tag) {
            throw new Error('参数缺失！请按格式输入：node 脚本名 文章名 文档标签 文档概述(可选) 文档状态(可选)');
        }
        // 4参数版
        // const overview = Overview ? Overview : "";
        // const state = State ? State : "";

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
            console.log(`✅ ${colors.green('成功创建目录：')}${articleDir}`);
        }

        // 创建笔记文件
        const notePath = path.join(articleDir, 'note.md');
        if (!fs.existsSync(notePath)) {
            fs.writeFileSync(notePath, `# ${articleName}\n\n${overview}\n`);
            console.log(`📝 ${colors.green('已创建笔记文件：')}${notePath}`);
        }

        // 处理标签文件
        const tagFilePath = path.join(TAGS_DIR, `${tag}.md`);
        if (!fs.existsSync(tagFilePath)) {
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
        console.log(`🏷️ ${colors.green('已更新')} 分类文档 标签文件：${tagFilePath}`);
        // 追加到所有文档标签文件
        fs.appendFileSync(AllDocuments_DIR, recordData);
        fs.appendFileSync(TAG_DIR, recordData);
        console.log(`🏷️ ${colors.green('已更新')} 所有文档 标签文件：${AllDocuments_DIR} + ${TAG_DIR}`);
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
