<template>

    <div class="paper-card">
        <div class="card-content">
            <span class="card-title">Card</span><br>
            
            <span class="phone"></span><br>
            <span class="fax"></span><br>

            <span class="emai"></span><br>
            <span class="address"></span><br>
            <span class="webUrl"></span><br>


        </div>
        <svg class="icon" viewBox="0 0 1024 1024" width="25" height="25">
            <path
                d="M854.826667 629.12a365.44 365.44 0 0 0-139.093334-182.4l-26.453333-192H746.666667a42.666667 42.666667 0 0 0 42.666666-42.666667v-85.333333a42.666667 42.666667 0 0 0-42.666666-42.666667H277.333333a42.666667 42.666667 0 0 0-42.666666 42.666667v85.333333a42.666667 42.666667 0 0 0 42.666666 42.666667h55.68L306.346667 448a362.666667 362.666667 0 0 0-137.173334 180.906667 42.666667 42.666667 0 0 0 5.76 38.826666 42.666667 42.666667 0 0 0 34.56 17.92H490.666667v183.04l13.013333 64a8.533333 8.533333 0 0 0 16.64 0l13.013333-64v-182.826666h281.173334a42.666667 42.666667 0 0 0 34.56-17.92 42.666667 42.666667 0 0 0 5.76-38.826667z m-40.32 14.08H209.493333a322.56 322.56 0 0 1 125.44-162.773333 29.226667 29.226667 0 0 0 12.8-21.333334l29.44-213.333333a29.226667 29.226667 0 0 0-7.04-23.68 29.653333 29.653333 0 0 0-22.613333-10.24H277.333333v-85.333333h469.333334v85.333333h-72.106667a29.653333 29.653333 0 0 0-22.4 10.24 29.013333 29.013333 0 0 0-7.04 23.68l29.226667 213.333333a29.653333 29.653333 0 0 0 13.013333 21.333334 323.413333 323.413333 0 0 1 128 163.84l21.333333-6.826667z"
                p-id="3035" fill="#a19e9e"></path>
        </svg>
        <div class="contact-info">
            <!-- 联系方式 -->
            Email: yumengjh@outlook
        </div>
    </div>

</template>

<script>

</script>

<style scoped>
/* 纸质卡片样式 */
.paper-card {
    font-family: Arial, sans-serif;
    width: 300px;
    height: 250px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    padding: 20px;
    text-align: center;
    font-size: 18px;
    color: #333;
}

/* 卡片纹理效果 */
.paper-card::before {

    content: "";
    position: absolute;
    top: 0;
    left: 17px;
    width: 90%;
    height: 100%;
    background: repeating-linear-gradient(0deg,
            transparent,
            transparent 24px,
            rgba(0, 0, 0, 0.05) 24px,
            rgba(0, 0, 0, 0.05) 25px);
    pointer-events: none;
    /* 防止遮挡点击事件 */
}

/* 卡片阴影效果 */
.paper-card::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 90%;
    height: 20px;
    background: rgba(0, 0, 0, 0.1);
    filter: blur(10px);
    transform: translateX(-50%);
    z-index: 1;
}

/* 卡片内容样式 */
.card-content {
    position: relative;
    z-index: 1;
    top: -1px;
    line-height: 25px;
    font-size: 12px;
}

.contact-info {
    margin-top: 25px;
    font-size: 12px;
    color: #666;
}

.icon {
    position: absolute;
    top: 10px;
    left: 10px;
    transform: rotate(45deg);
}

.card-title {
    font-size: 39px;
    font-weight: bold;
    color: #adadad;
}

</style>