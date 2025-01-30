const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

// 定义要处理的 Markdown 文件路径
const mdFiles = glob.sync('docs/**/*.md');

// 正则表达式匹配 Markdown 中的图片标签
const imageRegex = /!\[(.*?)\]\((.*?)\)/g;

// 替换函数，将 Markdown 图片标签替换为懒加载的 img 标签
function replaceImages(content) {
  return content.replace(imageRegex, (match, alt, src) => {
    // 将路径中的反斜杠（\）替换为正斜杠（/）
    const normalizedSrc = src.replace(/\\/g, '/');
    return `<img v-lazy="'${normalizedSrc}'" alt="${alt}" />`;
  });
}

// 遍历所有 Markdown 文件并进行替换
mdFiles.forEach((file) => {
  const filePath = path.resolve(file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceImages(content);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`已处理: ${file}`);
});

console.log('所有图像都已替换为延迟加载的 img 标签。');