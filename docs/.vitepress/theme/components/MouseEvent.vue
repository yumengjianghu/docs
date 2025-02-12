<template>

</template>

<script setup lang="ts">
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

if(detectDeviceType()=='desktop'){
  new CursorEffects.rainbowCursor({
    length: 8,
      // colors: ['#FF006E', '#FFBE0B', '#8338EC', '#3A86FF', '#FF38DC']  , //赛博霓虹风
    // colors: ['#00F5D4', '#00BBF9', '#009FFD', '#6F2DBD', '#7400B8'], //流体渐变
    // colors:['#F94144', '#F3722C', '#F8961E', '#90BE6D', '#43AA8B'] ,  //自然过渡
    colors:['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'],  //彩虹衍射
    // colors:['#A8DADC', '#457B9D', '#1D3557', '#E63946', '#F4A261'] , //冷系幻彩
    size: 2,
});
}
else if(detectDeviceType()=='mobile'){
  new CursorEffects.characterCursor({ 
    element: document.querySelector("#character"), 
    characters: ["*", "*", "*","*","*"],
    font: "20px serif",
    colors: [
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff",
    ],
    characterLifeSpanFunction: function() {
        return Math.floor(Math.random() * 60 + 80);
    },
    initialCharacterVelocityFunction: function() {
        return {
            x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
            y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
        }
    },
    characterVelocityChangeFunctions: {
      x_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/30;
      },
      y_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/ 15;
      },
    },
    characterScalingFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        return Math.max(lifeLeft / lifeSpan * 2, 0);
    },
    characterNewRotationDegreesFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        // console.log(age, lifeSpan);
        return lifeLeft / 5;
    }
})
}
// new CursorEffects.rainbowCursor({
//   length: 8,
//   colors: [  "#FE0000",
//     "#FD8C00",
//     "#FFE500",
//     "#119F0B",
//     "#0644B3",
//     "#C22EDC",],
//   size: 3,
// })


// new CursorEffects.rainbowCursor({
//     length: 10,
//     colors: ['#3e63dd'],
//     size: 10,
// });
// 表情挂饰
// new CursorEffects.springyEmojiCursor({ emoji: "💕" });

// 字符溢出掉落，颜色自定义
// new CursorEffects.fairyDustCursor({
//   colors: ["#89a3f0", "#a44bef", "#e570e2"],
// });

// 溢出掉落
// new CursorEffects.emojiCursor({ emoji: ["🔥", "🐬", "🦆"], delay: 25 });

//小人跟随
// new CursorEffects.trailingCursor({particles: 5, rate: 0.7, baseImageSrc: "../../public/cursor.svg"});
// document.body.style.cursor = 'none';
// 雪花特效
// new CursorEffects.characterCursor({ 
//     element: document.querySelector("#character"), 
//     characters: ["*", "*", "*","*","*"],
//     font: "20px serif",
//     colors: [
//         "#ffffff",
//         "#ffffff",
//         "#ffffff",
//         "#ffffff",
//         "#ffffff",
//     ],
//     characterLifeSpanFunction: function() {
//         return Math.floor(Math.random() * 60 + 80);
//     },
//     initialCharacterVelocityFunction: function() {
//         return {
//             x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
//             y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
//         }
//     },
//     characterVelocityChangeFunctions: {
//       x_func: function(age, lifeSpan) {
//         return (Math.random() < 0.5 ? -1 : 1)/30;
//       },
//       y_func: function(age, lifeSpan) {
//         return (Math.random() < 0.5 ? -1 : 1)/ 15;
//       },
//     },
//     characterScalingFunction: function(age, lifeSpan) {
//         let lifeLeft = lifeSpan - age;
//         return Math.max(lifeLeft / lifeSpan * 2, 0);
//     },
//     characterNewRotationDegreesFunction: function(age, lifeSpan) {
//         let lifeLeft = lifeSpan - age;
//         console.log(age, lifeSpan);
//         return lifeLeft / 5;
//     }
// })
</script>

<style scoped></style>