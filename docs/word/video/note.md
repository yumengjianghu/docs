# 自定义视频组件
<!-- 支持多语言字幕，可以通过 subtitles 属性传递字幕文件列表 -->

> [!IMPORTANT]
>
> **视频地址使用HTTP，一些浏览器不支持https+http混用导致无法播放**

<animation
      videoSrc="http://squv82ws7.hd-bkt.clouddn.com/1565311997-1-16.mp4" 
      :subtitles="[
        {subtitle:{lang:'zh',label:'1',src:'1'},index:1}
      ]"
    />

<!-- # Bilibili 视频演示

以下是一个 Bilibili 视频示例：

<iframe
  width="100%"
  height="800px"
  src="https://www.bilibili.com/video/BV1Yg4y127Fp?vd_source=3e46d32094b981673e11bfbadc3d8bf1"
  scrolling="no"
  border="0"
  frameborder="no"
  framespacing="0"
  allowfullscreen="true"
>视频</iframe> -->

## 评论
<Giscus />
