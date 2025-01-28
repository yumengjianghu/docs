<template>
    <header>
        <h1 class="name">张三</h1>
        <div class="title">高级前端开发工程师</div>
        <div class="contact-info">
            <p>📧 zyyypx@qq.com | 📱 138-xxxx-21254</p>
            <p>🌐 https://yumengjianghu.github.io/docs/ | 📍 广东市</p>
        </div>
    </header>

    <section>
        <h2>个人简介</h2>
        <p>5年前端开发经验，专注于现代Web应用开发。熟练掌握React、Vue等主流框架，对性能优化和用户体验有深入研究。具有良好的团队协作能力和项目管理经验。</p>
    </section>

    <section>
        <h2>工作经历</h2>
        <div class="experience-item">
            <div class="experience-header">
                <span class="company">ABC科技有限公司</span>
                <span class="date">2020.07 - 至今</span>
            </div>
            <div class="position">高级前端开发工程师</div>
            <ul>
                <li>负责公司核心产品的前端架构设计和开发</li>
                <li>带领团队完成多个重要项目，提升产品性能30%</li>
                <li>推动前端工程化建设，建立组件库和开发规范</li>
            </ul>
        </div>

        <div class="experience-item">
            <div class="experience-header">
                <span class="company">XYZ互联网公司</span>
                <span class="date">2018.03 - 2020.06</span>
            </div>
            <div class="position">前端开发工程师</div>
            <ul>
                <li>参与电商平台的开发和维护</li>
                <li>优化网站性能，提升用户体验</li>
                <li>开发多个高复用性组件</li>
            </ul>
        </div>
    </section>

    <section>
        <h2>技术技能</h2>
        <div class="skills">
            <span class="skill-tag">JavaScript</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">React</span>
            <span class="skill-tag">Vue</span>
            <span class="skill-tag">Node.js</span>
            <span class="skill-tag">Webpack</span>
            <span class="skill-tag">Git</span>
            <span class="skill-tag">HTML5</span>
            <span class="skill-tag">CSS3</span>
        </div>
    </section>

    <section>
        <h2>教育背景</h2>
        <div class="experience-item">
            <div class="experience-header">
                <span class="company">某某大学</span>
                <span class="date">2014.09 - 2026.06</span>
            </div>
            <div class="position">计算机科学与技术 学士学位</div>
        </div>
    </section>
    <GlobalToast ref="toast" :duration="2000" />
</template>

<script setup>
import { ref, onMounted, warn } from 'vue';
const toast = ref(null);
const showToast = (message, status) => {
    toast.value.show(message, status); // 调用子组件的 show 方法
};
onMounted(() => {
    showToast("推荐PC浏览器打开", "warn", false, false)
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
    animation: fadeIn 1s ease-out;
}
header {
    text-align: center;
    padding: 40px 0;
    background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    margin-bottom: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transform: translateY(-20px);
    opacity: 0;
    animation: slideDown 0.8s ease-out forwards;
}

.name {
    background: linear-gradient(120deg, #2196F3, #00BCD4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 2.8em;
    font-weight: bold;
    margin-bottom: 15px;
}

.title {
    color: #666;
    font-size: 1.2em;
}

.contact-info {
    margin: 20px 0;
}

section {
    background: rgba(255, 255, 255, 0.9);
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 30px;
    transform: translateY(20px);
    opacity: 0;
    animation: slideUp 0.8s ease-out forwards;
    animation-delay: calc(var(--delay) * 0.2s);
}

h2 {
    border-bottom: none;
    padding-bottom: 10px;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
}

h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #007bff, #00e1ff);
    border-radius: 2px;
}

.experience-item {
    transition: all 0.3s ease;
    padding: 15px;
    border-radius: 8px;
}

.experience-item:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(10px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.experience-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.company {
    font-weight: bold;
}

.date {
    color: #666;
}

.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.skill-tag {
    background: linear-gradient(135deg, #007bff, #00d2ff);
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 0.9em;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2);
}

.skill-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

/* 动画关键帧 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 添加响应式悬停效果 */
.contact-info p {
    transition: all 0.3s ease;
}

.contact-info p:hover {
    transform: scale(1.05);
}

/* 为每个section添加不同的动画延迟 */
section:nth-child(1) {
    --delay: 1;
}

section:nth-child(2) {
    --delay: 2;
}

section:nth-child(3) {
    --delay: 3;
}

section:nth-child(4) {
    --delay: 4;
}

/* 添加暗色模式支持 */
@media (prefers-color-scheme: dark) {
    body {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        color: #e0e0e0;
    }

    header,
    section {
        background: rgba(255, 255, 255, 0.05);
    }

    .skill-tag {
        background: linear-gradient(135deg, #1e88e5, #00acc1);
    }

    .experience-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}
</style>