<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
const nav = useNav()
const section = computed(() => {
  const current = nav.slides.value.slice(0, nav.currentPage.value)
  return current.findLast(slide => slide.meta.slide.frontmatter.section)
    ?.meta.slide.frontmatter.section || 'MỞ ĐẦU'
})
</script>
<template>
  <div class="deck-label">TRIE / CÂY TIỀN TỐ <span>{{ section }}</span></div>
  <footer class="deck-footer"><span>NHẬP MÔN TƯ DUY THUẬT TOÁN</span><span class="page-number">{{ $slidev.nav.currentPage }} <i>/ {{ $slidev.nav.total }}</i></span></footer>
</template>
<style scoped>
.deck-label { position:absolute; top:24px; left:54px; right:95px; color:#716d66; font:800 9px 'Nunito',sans-serif; letter-spacing:.11em; display:flex; justify-content:space-between; pointer-events:none; }
.deck-footer { position:absolute; left:54px; right:54px; bottom:16px; border-top:1px solid #c9c3b9; padding-top:10px; display:flex; justify-content:space-between; color:#716d66; font:750 9px 'Nunito',sans-serif; letter-spacing:.08em; pointer-events:none; }
.page-number { color:#242321; font-size:11px; }
.page-number i { font-style:normal; color:#8e877b; }
</style>
