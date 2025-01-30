## 踩坑点：
使用md编辑文档时候，最好不要使用 <> 尖括号，否则有可能会报错，因为md文档会转换成html页面，导致报错'缺少标签'

[X]代办：编写脚本把所有img标签加上v-lazy指令

[X]代办：全局css文件修改

[X]代办：Nuxt.js


## 网络懒加载图片
### 托管平台使用 - [路过图床](https://imgse.com)
<img v-lazy="'https://s21.ax1x.com/2025/01/30/pEVIocT.png'" alt="加载中..." />
<hr>
<img v-lazy="'https://s21.ax1x.com/2025/01/30/pEVII3V.png'" alt="加载中..." />

## 网络懒加载图片
### 托管平台使用 - [七牛云](https://portal.qiniu.com/)
> [!CAUTION]
>
> **本图片由AI生成 ❗**

<img v-lazy="'http://squv82ws7.hd-bkt.clouddn.com/332936306_0_final.png'" alt="加载中..." />

> [!WARNING]
>
>😮 如果**图片过大**，且**网速不好**，加载时间可达到**1分钟+** 

## 本地懒加载图片
<img v-lazy="'images/guangzhou.jpg'" alt="加载中..." />






<!-- <img src="/public/background.png" alt=""> -->
## 评论
<Giscus />