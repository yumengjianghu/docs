<template>
  <div ref="giscus" class="giscus"></div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'myfishdream/docs')
    script.setAttribute('data-repo-id', 'R_kgDONkljsg')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDONkljss4CmUy0')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    if (document.querySelector("html").className) {
      script.setAttribute('data-theme', 'dark')
    } else {
      script.setAttribute('data-theme', 'light')
    }
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    this.$refs.giscus.appendChild(script)
  }
}
</script>
