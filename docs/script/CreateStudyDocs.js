const fs = require('fs');
const path = require('path');
const readline = require('readline');
// 创建命令行接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const BASE_PATH = 'F:/静态技术栈-Beta/Github-docs/docs';
const STUDY_DIR = path.join(BASE_PATH, 'study.md');


async function main() {
    tagColor = 'red'
    const [articleName, tagColor] = process.argv.slice(2);
    if (!articleName) {
        throw new Error('参数缺失！请按格式输入：node 脚本名 文章名 标签颜色(可选)');
    }
    // 获取文档概述
    const overview = await new Promise(resolve => {
        rl.question('请输入文档概述：', answer => resolve(answer));
    });
    // 获取文档状态
    const state = await new Promise(resolve => {
        rl.question('请输入文档状态：', answer => resolve(answer));
    });

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

    fs.appendFileSync(STUDY_DIR, recordData);
    console.log(`🏷️ ${colors.green('已更新')} 主页 Study 文件：${tagFilePath}`);
}   