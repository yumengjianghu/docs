# 自定义域名注意事项

原本使用GIthub pages分配的域名在代码中，引用一些图片需要使用`/docs/`路径

例如：要引入warn.svg，它在status文件夹内，之前都是使用`/docs/status/warn.svg`

在使用自定义域名后，将改成`/status/warn.svg`

> [!IMPORTANT]
>
> 在config.js中也取消⬇
>
> ```js
> base:"/docs/"
> ```
>
> 否则无法加载CSS/JS

> [!TIP]
>
> 貌似全局原本使用`/docs/......`在使用自定义域名后不需要使用`docs`路径

> [!CAUTION]
>
> emmmm，我去掉`docs`以后，**build**之后貌似也能正常显示
>
> 好吧，是我之前一直搞错了，就没必要加`docs`
> <img v-lazy="'/emoji/小丑.webp'">



测试时发现：开发版本加载本地图片失败，但是生产版本可以😕
<MouseEvent/>
<Like/>