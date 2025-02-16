<template>

</template>

<script setup lang="js">
import * as CursorEffects from "cursor-effects";

/**
 * 检测设备类型 (优化版)
 * @returns { 'mobile' | 'tablet' | 'desktop' }
 */
function detectDeviceType() {
  const ua = navigator.userAgent;

  // 优先检测关键特征
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileSize = window.matchMedia('(max-width: 768px)').matches;

  // 详细 UA 检测(平板电脑需额外处理)
  const isAndroidTablet = /Android/.test(ua) && !/Mobile/.test(ua);
  const isIPad = /iPad|Macintosh/.test(ua) && 'ontouchend' in document;

  // 分级判断
  if (isAndroidTablet || isIPad) return 'tablet';

  if (
    /(iPhone|iPod|Android|Mobile|BlackBerry|IEMobile)/.test(ua) ||
    (hasTouch && isMobileSize)
  ) {
    return 'mobile';
  }

  return 'desktop';
}
console.log(detectDeviceType());

if (detectDeviceType() == 'desktop') {
  new CursorEffects.rainbowCursor({
    length: 8,
    // colors: ['#FF006E', '#FFBE0B', '#8338EC', '#3A86FF', '#FF38DC']  , //赛博霓虹风
    // colors: ['#00F5D4', '#00BBF9', '#009FFD', '#6F2DBD', '#7400B8'], //流体渐变
    // colors:['#F94144', '#F3722C', '#F8961E', '#90BE6D', '#43AA8B'] ,  //自然过渡
    colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'],  //彩虹衍射
    // colors:['#A8DADC', '#457B9D', '#1D3557', '#E63946', '#F4A261'] , //冷系幻彩
    size: 2,
  });
}
else if (detectDeviceType() == 'mobile') {
  // ...
}

</script>

<style scoped></style>