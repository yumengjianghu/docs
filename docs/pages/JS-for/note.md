---
# 文档基本信息
title: 循环遍历
date: 2025-2-12-    # 创建日期，格式：YYYY-MM-DD
author: YuMeng    # 作者（可选）

# 分类和标签
category: 技术文档  # 主分类，只能有一个
tags: 
  - 笔记   # 标签列表，可以有多个
  - 教程   
  - JavaScript
# 文档描述
description: JS中各种循环遍历详解

# 额外信息（可选）
# image: /path/to/cover.jpg  # 封面图片
# sticky: 0                  # 置顶顺序，数字越大越靠前
# star: false                # 是否标星
---

# 循环遍历

## for/forEach

在性能上 **for > forEach**

- for循环直接操作索引，没有额外的函数调用和上下文，所以性能是最快的
- for可以使用break终止，forEach不支持 跳出循环

```js
        let arrs = [...Array(999999).keys()]
        let total = 0;
        let startTime = Date.now();
        for (let i = 0; i < arrs.length; i++) total += i;
        let endTime = Date.now()
        let countTime = endTime - startTime;
        console.log('Count:', total);
        console.log("Time:", countTime);
```

```js
        let arrs = [...Array(999999).keys()]
        let total = 0;
        let startTime = Date.now();
        arrs.forEach(item => {
            total += item;
        })
        let endTime = Date.now()
        let countTime = endTime - startTime;
        console.log('Count:', total);
        console.log("Time:", countTime);
```

> [!IMPORTANT]
>
> forEach不支持异步任务（async-await），不会等待异步任务，或者使用for

## map

map()方法是数组原型的一个函数，对数组遍历不会破坏数组，将会创建一个新数组，**按照原数组元素的顺序依次执行给定义的函数**，**返回一个新数组**

适用于处理数组中的每个元素并且生成一个新的数组。

语法：

```js
map(callbackFuction)
map(callbackFuction,thisArray)
```

参数：

回调函数：
**element**数组中当前正在处理的元素

**index**正在处理的元素在数组中的索引

**array** 原数组

> [!IMPORTANT]
>
> 使用for循环进行网络请求是**依次发送**，用<u>map+promise</u>All可以实现**并发请求**

## filter

filter()方法会对数组的每个元素应用指定的函数，并返回一个新的数组，其中**只有符合条件的元素**，并且原数组不受到影响，**只有满足True才能被处理到新数组中**	

**参数**：

回调函数：
**element**:数组中正在处理的元素

**index**:正在处理元素的索引值

**array**：原数组

过滤实现去重效果

indexOf方法返回**第一个**匹配的元素的索引

```js
        let arrs = [1, 4, 5, 6, 6, 2, 4, 5, 6]
        let NewArrs = arrs.filter((item, index, arrs) => {
            return arrs.indexOf(item) == index
        })
        console.log(NewArrs);
```

filter + map组合使用(**链式调用**)，实现**去除无用信息加自定义属性**

```js
let student = [
    { id: 1, name: 'zhangsan' },
    { id: 2, name: 'lisi' },
    { id: undefined, name: 'wangwu' },
    { id: 3, name: 'ergou' },
]
let NewStudent = student.filter((item) => {
    return item.id
}).map((item) => {
    return {
        ...item,
        sex: '男'
    }
})
console.log(NewStudent);

// {id: 1, name: 'zhangsan', sex: '男'}
// {id: 2, name: 'lisi', sex: '男'}
// {id: 3, name: 'ergou', sex: '男'}
```

