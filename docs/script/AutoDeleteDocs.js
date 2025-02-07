const fs = require('fs');
const path = require('path');

// 颜色模块+清屏模块
const colors = require('ansi-colors');
const clear = require('clear')

// 获取用户输入参数
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error(colors.red('请提供两个或者一个参数：代码块标题 和要删除的文件夹名称'));
    process.exit(1);
}

const targetTitle = args[0];
const targetFolder = args[1] ? args[1] : args[0];

// 定义需要操作的文件夹路径
const docsPath = path.join('F:\\静态技术栈-Beta\\Github-docs\\docs');
const tagsPath = path.join(docsPath, 'tags');
const wordPath = path.join(docsPath, 'word');

// 检查所有路径是否存在
if (!fs.existsSync(docsPath)) {
    console.error(`${colors.red('错误：')}docs 文件夹不存在: ${docsPath}`);
    process.exit(1);
}

if (!fs.existsSync(tagsPath)) {
    console.error(`${colors.red('错误：')}tags 文件夹不存在: ${tagsPath}`);
    process.exit(1);
}

if (!fs.existsSync(wordPath)) {
    console.error(`${colors.red('错误： ')}word 文件夹不存在:${wordPath}`);
    process.exit(1);
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
            }
        }
    });
};

// 删除指定文件夹及其子文件
const deleteFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`${colors.green('✔成功删除')},删除了文件夹 ${folderPath} 及其子文件`);
    } else {
        console.error(`${colors.red('错误：')}文件夹不存在: ${folderPath}`);
    }
};

// 执行删除操作
deleteFromPath(docsPath);
deleteFromPath(tagsPath);
deleteFolder(path.join(wordPath, targetFolder));

console.log('⚡ '+colors.bgGreenBright('删除完成！'));
