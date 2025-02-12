---
# 文档基本信息
title: Uniapp
date: 2024-12-23-    # 创建日期，格式：YYYY-MM-DD
author: YuMeng    # 作者（可选）

# 分类和标签
category: 技术文档  # 主分类，只能有一个
tags: 
  - 笔记   # 标签列表，可以有多个
  - 教程   
  - Uniapp
# 文档描述
description: Uniapp笔记

# 额外信息（可选）
# image: /path/to/cover.jpg  # 封面图片
# sticky: 0                  # 置顶顺序，数字越大越靠前
# star: false                # 是否标星
---



# uniapp

## 组件

在项目文件夹中创建一个与`pages`同级的文件夹`components`用于存放子组件

**注意：** 在HBuilder X中如果文件夹名字创建正确右键文件夹会有**新建组件**选项

**最后在有需要的地方直接使用即可，在uniapp不用引入可以直接使用**（<u>创建子组件时候要勾选**创建同名目录**</u>）



## 页面

开发者应该谨慎写`export default`外面的代码

- 影响应用性能，外面的代码会在应用启动时执行，而不是页面加载，如果这部分代码写太复杂，容易占用内存
- 不跟随组件，页面关闭而回收，必须手动处理(生命周期)

定义在`export default`内的一般是主逻辑代码

在Uniapp中，style的写法和web基本相同

但是页面是uvue，使用原生的渲染不是webview渲染，支持的css有限



## 评论
<Giscus />