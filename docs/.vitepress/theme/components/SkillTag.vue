<template>
  <div class="skills-container">
    <div class="skills-grid">
      <div v-for="(skill, index) in skills" 
           :key="index"
           class="skill-tag"
      >
        <div class="skill-icon">
          <img :src="skill.icon" :alt="skill.title">
        </div>
        <span class="skill-title" :style="{ color: skill.color }">{{ skill.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  skills: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.skills-container {
  margin: 1rem 0;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.skill-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.skill-title {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .skill-tag {
    background: var(--vp-c-bg-mute);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .skills-grid {
    gap: 8px;
  }
  
  .skill-tag {
    padding: 4px 10px;
  }
  
  .skill-icon {
    width: 20px;
    height: 20px;
  }
  
  .skill-icon img {
    width: 16px;
    height: 16px;
  }
}
</style> 