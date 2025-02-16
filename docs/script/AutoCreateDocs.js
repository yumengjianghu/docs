const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const colors = require('ansi-colors');
const clear = require('clear');
const presets = require('./config/presets');

// 查找 pages 目录
function findPagesDir(startPath) {
    let currentPath = startPath;
    while (currentPath !== path.parse(currentPath).root) {
        const pagesPath = path.join(currentPath, 'pages');
        if (fs.existsSync(pagesPath)) {
            return pagesPath;
        }
        currentPath = path.dirname(currentPath);
    }
    throw new Error('未找到 pages 目录！请确保在项目目录下执行此脚本。');
}

// 打开文件
function openFile(filePath) {
    const command = process.platform === 'win32' 
        ? `start "" "${filePath}"` 
        : process.platform === 'darwin'
            ? `open "${filePath}"`
            : `xdg-open "${filePath}"`;
    exec(command);
}

// 格式化日期
function formatDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// 创建 Frontmatter
function createFrontmatter(title, author, overview, category, tags) {
    return `---
# 文档基本信息
title: ${title}
date: ${formatDate()}-    # 创建日期
author: ${author || 'YuMeng'}    # 作者

# 分类和标签
category: ${category}  # 主分类
tags: ${tags}

# 文档描述
description: ${overview}

# 额外信息（可选）
# image: /path/to/cover.jpg
# sticky: 0
# star: false
---

# ${title}

${overview}
`;
}

// 处理用户输入
function question(query) {
    const stdin = process.stdin;
    const stdout = process.stdout;

    return new Promise(resolve => {
        stdin.resume();
        stdout.write(colors.yellow(query));

        stdin.once('data', data => {
            stdin.pause();
            resolve(data.toString().trim());
        });
    });
}

// 处理菜单选择
async function handleSelection(items, prompt, selectedItems = []) {
    let currentIndex = 0;
    const stdin = process.stdin;
    
    // 显示菜单
    function showMenu() {
        console.clear();
        console.log(colors.yellow(prompt));
        if (selectedItems.length > 0) {
            console.log(colors.gray(`已选择: ${selectedItems.join(', ')}`));
        }
        console.log();
        
        items.forEach((item, index) => {
            const prefix = index === currentIndex ? colors.cyan('→ ') : '  ';
            console.log(`${prefix}${item}`);
        });
    }

    return new Promise(resolve => {
        // 设置输入模式
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        showMenu();

        function handleKey(key) {
            switch(key) {
                case '\u001B[A': // 上箭头
                    currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                    showMenu();
                    break;
                case '\u001B[B': // 下箭头
                    currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                    showMenu();
                    break;
                case '\r': // 回车
                    stdin.removeAllListeners('data');
                    stdin.setRawMode(false);
                    stdin.pause();
                    
                    const selectedItem = items[currentIndex];
                    if (selectedItem === '自定义') {
                        // 处理自定义输入
                        console.log('\n');
                        const rl = require('readline').createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        
                        rl.question(colors.yellow('请输入自定义内容：'), answer => {
                            rl.close();
                            resolve(answer.trim() || '未分类'); // 提供默认值
                        });
                    } else {
                        resolve(selectedItem);
                    }
                    break;
                case '\u0003': // Ctrl+C
                    process.exit();
                    break;
            }
        }

        stdin.on('data', handleKey);
    });
}

// 扫描所有文档
function scanDocs(pagesDir) {
    const docs = [];
    const items = fs.readdirSync(pagesDir);
    
    items.forEach(item => {
        const fullPath = path.join(pagesDir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            const notePath = path.join(fullPath, 'note.md');
            if (fs.existsSync(notePath)) {
                docs.push({
                    title: item,
                    path: fullPath
                });
            }
        }
    });
    
    return docs;
}

// 删除文档
async function deleteDoc(docPath) {
    return new Promise((resolve, reject) => {
        fs.rm(docPath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// 主函数
async function main() {
    while (true) {
        try {
            clear();
            
            // 选择操作
            const operations = [
                '创建文档',
                '删除文档',
                '退出程序'
            ];
            
            console.log(colors.cyan('📝 文档管理工具\n'));
            const operation = await handleSelection(operations, '请选择操作：');
            
            if (operation === '退出程序') {
                console.log(colors.gray('\n已退出程序'));
                process.exit(0);
            }
            
            if (operation === '创建文档') {
                // 获取文档标题（必填）
                let title = '';
                while (!title) {
                    title = await question('请输入文档标题：');
                    if (!title) {
                        console.log(colors.red('❌ 标题不能为空！'));
                    }
                }
                
                // 获取作者（可选，有默认值）
                const authorInput = await question('请输入作者（直接回车使用默认值 YuMeng）：');
                const author = authorInput || 'YuMeng';

                console.log(colors.cyan('📝 开始创建文档...\n'));
                console.log(colors.gray(`作者: ${author}\n`));

                // 获取文档概述
                const overview = await question('请输入文档概述：');

                // 选择主题
                console.log(colors.yellow('\n使用上下箭头选择主题，回车确认'));
                const category = await handleSelection(presets.categories, '选择主题：');

                // 选择标签
                const selectedTags = new Set();
                while (true) {
                    const availableTags = presets.tags.filter(t => !selectedTags.has(t));
                    const tag = await handleSelection(
                        availableTags,
                        '选择标签：',
                        Array.from(selectedTags)
                    );

                    if (tag === '自定义') {
                        const customTag = await question('\n请输入自定义标签：');
                        if (customTag) selectedTags.add(customTag);
                    } else {
                        selectedTags.add(tag);
                    }

                    const continueAdding = await question('\n是否继续添加标签？(y/N)：');
                    if (continueAdding.toLowerCase() !== 'y') break;
                }

                // 创建文件
                const pagesDir = findPagesDir(__dirname);
                const articleDir = path.join(pagesDir, title);
                
                if (!fs.existsSync(articleDir)) {
                    fs.mkdirSync(articleDir, { recursive: true });
                    console.log(`\n✅ ${colors.green('成功创建目录：')}${articleDir}`);
                }

                const notePath = path.join(articleDir, 'note.md');
                const frontmatter = createFrontmatter(
                    title,
                    author,
                    overview,
                    category,
                    Array.from(selectedTags).map(tag => `\n  - ${tag}`).join('')
                );

                if (!fs.existsSync(notePath)) {
                    fs.writeFileSync(notePath, frontmatter);
                    console.log(`📝 ${colors.green('已创建笔记文件：')}${notePath}`);
                }

                console.log(colors.cyan('\n🚀 准备打开文件...\n'));
                openFile(notePath);
                console.log(`⚡ ${colors.bgGreen('文件已打开，可以开始编辑了！')}\n`);
                
                // 等待用户确认后返回主菜单
                await question(colors.gray('按回车键返回主菜单...'));
                
            } else if (operation === '删除文档') {
                const pagesDir = findPagesDir(__dirname);
                const docs = scanDocs(pagesDir);
                
                if (docs.length === 0) {
                    console.log(colors.yellow('\n没有找到任何文档！'));
                    process.exit(0);
                }
                
                console.log(colors.yellow('\n使用上下箭头选择要删除的文档，回车确认'));
                const docTitles = docs.map(doc => doc.title);
                const selectedTitle = await handleSelection(docTitles, '选择要删除的文档：');
                
                const selectedDoc = docs.find(doc => doc.title === selectedTitle);
                if (selectedDoc) {
                    const confirm = await question(
                        colors.red(`\n确定要删除文档 "${selectedTitle}" 吗？此操作不可恢复！(y/N)：`)
                    );
                    
                    if (confirm.toLowerCase() === 'y') {
                        await deleteDoc(selectedDoc.path);
                        console.log(colors.green(`\n✅ 文档 "${selectedTitle}" 已删除！`));
                    } else {
                        console.log(colors.gray('\n已取消删除操作'));
                    }
                    
                    // 等待用户确认后返回主菜单
                    await question(colors.gray('\n按回车键返回主菜单...'));
                }
            }
            
        } catch (error) {
            console.error(colors.red(`\n❌ 错误：${error.message}\n`));
            await question(colors.gray('按回车键返回主菜单...'));
        }
    }
}

main();
