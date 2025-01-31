## 代办事项
<ToDos  title="快速学习Nuxt.js"/>
<ToDos  title="全局css文件修改"/>
<ToDos  title="md文档图片添加懒加载功能"/>

## 思维导图

<MindMap :data="mindMapData" />

<script setup>
const mindMapData = {
  name: "Web",
  children: [
    {
      name: "前端",
      children: [
        { name: "HTML5" },
        { name: "CSS3",
            children: [
            { name: "SCSS" },
            { name: "..." },
          ],
         },
        {
          name: "JavaScript",
          children: [
            { name: "ECMAScript" },
            { name: "TypeScript" },
            { name: "Vue",
                children: [
            { name: "Vue2" },
            { name: "Vue3" ,},

          ],
             },
            { name: "Uniapp" },
            { name: "React" },
          ],
        },
      ],
    },
    {
      name: "后端",
      children: [
        { name: "Node.js" },
        { name: "Java" },
        { name: "SQL Server" },
        { name: "My SQL" },
        { name: "MongDB" },
      ],
    },
     {
      name: "其他",
      children: [
        { name: "Git/Github" },
        { name: "Docker" },
        { name: "Electron" },
        {name:'Nginx'}

      ],
    },
  ],
};
</script>

**待完成**

## 评论
<Giscus />