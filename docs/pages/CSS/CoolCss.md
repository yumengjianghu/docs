## 文字交融效果

 ```vue preview
<template>
 <div class="content">
        <span class="text">YuMengJiangHu</span>
    </div>
</template>
<style scoped>
 .content {
            margin-top: 50px;
            text-align: center;
            background-color: #000;
            filter: contrast(30);
        }

        .text {
            font-size: 100px;
            color: #fff;
            animation: showup 3s forwards infinite;
        }

        @keyframes showup {
            from {
                letter-spacing: -55px;
                filter: blur(10px);
            }

            to {
                letter-spacing: 2px;
                filter: blur(2px);

            }
        }
</style>
```

## 背景适配

```vue preview
<template>
 <div class="banner">
        <h1 class="title">
            鱼梦江湖 遨游码海
        </h1>
    </div>
</template>
<style scoped>
  .banner {
            height: 300px;
            background: linear-gradient(60deg, #000, #000 50%, #fff 50%);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .title {
            font-size: 6em;
            transition: 0.5s;
            /* 颜色混合模式 */
            /* difference指的是两个颜色差值 */
            mix-blend-mode: difference;
            color: #fff;
        }

        .banner:hover .title {
            transform: translateX(-200px);
        }
</style>
```

## 3

```vue preview
<template>

</template>
<style scoped>

</style>
```

## 4

```vue preview
<template>

</template>
<style scoped>

</style>
```

## 5

```vue preview
<template>

</template>
<style scoped>

</style>
```

## 6

```vue preview
<template>

</template>
<style scoped>

</style>
```

## 7

```vue preview
<template>

</template>
<style scoped>

</style>
```