---
# 文档基本信息
title: pygame
date: 2024-2-13-    # 创建日期，格式：YYYY-MM-DD
author: YuMeng    # 作者（可选）

# 分类和标签
category: 技术文档  # 主分类，只能有一个
tags: 
  - 笔记   # 标签列表，可以有多个
  - 教程   
  - Python
# 文档描述
description: pygame相关笔记

# 额外信息（可选）
# image: /path/to/cover.jpg  # 封面图片
# sticky: 0                  # 置顶顺序，数字越大越靠前
# star: false                # 是否标星
---



# pyhton

```bash
pip install pygame
```

## 窗口

- Import的意思是导入需要的工具箱
- pygame.init()是初始化窗口的意思
- screen = pygame.display.set_mode((800, 600))创建窗口并设置大小
- pygame.display.set_caption('我的第一个game')设置窗口标题
- while True:游戏需要一直运行，所以得无限循环，直到停止
- for event in pygame.event.get():检查是否有事件（按下键盘，鼠标）
- if event.type == pygame.QUIT:判断用户的事件是某某，此处是**点击关闭**
- pygame.quit() 关闭pygame工具箱
- sys.exit()退出主程序
- screen.fill((255, 255, 255))设置窗口背景为白色
- pygame.display.flip() 更新窗口（当画完的东西要更新才能显示）

```py
import pygame
import sys
pygame.init()
screen=pygame.display.set_mode((800,600))
pygame.display.set_caption('我的第一个game')
while True:
    for event in pygame.event.get():
        if event.type==pygame.QUIT:
            pygame.quit()
            sys.exit()
        screen.fill((255,255,255))
        # pygame.draw.rect((200,200))
        pygame.display.flip()
```

## 绘画

### 矩形

```py
pygame.draw.rect(屏幕, 颜色, (x, y, 宽度, 高度), 边框宽度)
```

### **圆形**

```py
pygame.draw.circle(屏幕, 颜色, (x, y), 半径, 边框宽度)
```

### **线条**

```py
pygame.draw.line(屏幕, 颜色, (起点x, 起点y), (终点x, 终点y), 宽度)
```

### **多边形**

```py
pygame.draw.polygon(屏幕, 颜色, [(点1x, 点1y), (点2x, 点2y), ...], 边框宽度)
```

### **椭圆**

```py
pygame.draw.ellipse(屏幕, 颜色, (x, y, 宽度, 高度), 边框宽度)
```

### **弧线**

```py
pygame.draw.arc(屏幕, 颜色, (x, y, 宽度, 高度), 起始角度, 结束角度, 宽度)
```

### **多条线条**

```py
pygame.draw.lines(屏幕, 颜色, 是否闭合, [(点1x, 点1y), (点2x, 点2y), ...], 宽度)
```

