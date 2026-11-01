<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
const words = ['aaa', 'aab', 'bba']
const sigma = new Set(words.join('')).size
const length = Math.max(...words.map(word => word.length))
const nodes = [...new Set(['', ...words.flatMap(word => Array.from({ length: word.length }, (_, i) => word.slice(0, i + 1)))])]
  .map(key => ({ key, x: 0, y: 30 + key.length * 64 }))
let leaf = 0
function position(key: string): number {
  const node = nodes.find(node => node.key === key)!
  const children = nodes.filter(node => node.key.length === key.length + 1 && node.key.startsWith(key))
  node.x = children.length ? children.map(node => position(node.key)).reduce((a, b) => a + b, 0) / children.length : 75 + leaf++ * 125
  return node.x
}
position('')
const edges = nodes.filter(node => node.key).map(to => ({ from: nodes.find(node => node.key === to.key.slice(0, -1))!, to }))
const levels = Array.from({ length }, (_, i) => ({ depth: i + 1, count: nodes.filter(node => node.key.length === i + 1).length, bound: Math.min(words.length, sigma ** (i + 1)) }))
const depth = ref(-1)
const running = ref(false)
const done = computed(() => depth.value === length)
const total = computed(() => nodes.filter(node => node.key.length <= depth.value).length)
const bound = computed(() => 1 + levels.reduce((sum, level) => sum + level.bound, 0))
const { $page, $nav } = useSlideContext()
const marker = `depth-${useId()}`
let timer: ReturnType<typeof setTimeout> | undefined
function pause() { clearTimeout(timer); running.value = false }
function schedule() {
  timer = setTimeout(() => { depth.value++; if (done.value) pause(); else schedule() }, 900)
}
function run() {
  if (running.value) { pause(); return }
  if (depth.value < 0 || done.value) depth.value = 0
  running.value = true
  schedule()
}
watch(() => $nav.value.currentPage, page => { if (page !== $page.value) { pause(); depth.value = -1 } })
onBeforeUnmount(pause)
</script>
<template>
  <div class="depth-demo" :data-depth="depth" :data-running="running" @keydown.space.stop @keydown.enter.stop>
    <div class="example">3 từ: <code>aaa</code>, <code>aab</code>, <code>bba</code> · σ = 2 · L = 3</div>
    <svg viewBox="0 0 400 244" role="img" aria-label="Trie các từ aaa, aab, bba; đếm lần lượt từng tầng">
      <defs><marker :id="marker" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#888" /></marker></defs>
      <g v-for="edge in edges" :key="edge.to.key">
        <line :x1="edge.from.x" :y1="edge.from.y + 19" :x2="edge.to.x" :y2="edge.to.y - 21" stroke="#888" stroke-width="1.5" :marker-end="`url(#${marker})`" />
        <text :x="(edge.from.x + edge.to.x) / 2 + 10" :y="(edge.from.y + edge.to.y) / 2 + 3" class="edge-label">{{ edge.to.key.slice(-1) }}</text>
      </g>
      <g v-for="node in nodes" :key="node.key" :data-node="node.key" :data-counted="node.key.length <= depth" :class="{ active: node.key.length === depth }">
        <circle :cx="node.x" :cy="node.y" r="19" :fill="node.key.length === depth ? '#222' : '#fff'" stroke="#222" stroke-width="1.5" />
        <circle v-if="words.includes(node.key)" :cx="node.x" :cy="node.y" r="15" fill="none" :stroke="node.key.length === depth ? '#fff' : '#222'" />
        <text :x="node.x" :y="node.y + 4" text-anchor="middle" :fill="node.key.length === depth ? '#fff' : '#222'">{{ node.key || 'ε' }}</text>
      </g>
    </svg>
    <div class="counts">
      <div v-for="level in levels" :key="level.depth" :class="{ current: depth === level.depth, pending: depth < level.depth }" :data-level="level.depth">
        <span>Tầng {{ level.depth }}</span><span>min(3, 2<sup>{{ level.depth }}</sup>) = {{ level.bound }}</span><strong>{{ depth >= level.depth ? `${level.count} node` : '—' }}</strong>
      </div>
    </div>
    <div class="result" role="status" aria-live="polite">{{ depth < 0 ? 'Bắt đầu từ 1 node gốc.' : done ? `Thực tế: ${total} node · Cận: 1 + 2 + 3 + 3 = ${bound}.` : `Đã đếm: ${total} node, gồm gốc.` }}</div>
    <button type="button" :aria-label="running ? 'Dừng' : done ? 'Chạy lại' : depth >= 0 ? 'Tiếp tục' : 'Chạy thử'" :title="running ? 'Dừng' : done ? 'Chạy lại' : depth >= 0 ? 'Tiếp tục' : 'Chạy thử'" @click.stop="run"></button>
  </div>
</template>
<style scoped>
.depth-demo { text-align: center; width: 100%; }
.example { font-size: 13px; margin-bottom: 5px; }
.example code { background: none; padding: 0; }
svg { width: 100%; height: 150px; }
svg text { font: 13px 'Nunito', sans-serif; }
.edge-label { paint-order: stroke; stroke: #fff; stroke-width: 4px; }
.counts { margin: 4px 20px; font-size: 13px; }
.counts > div { display: grid; grid-template-columns: 1fr 1.5fr 1fr; padding: 4px 8px; border-bottom: 1px solid #ddd; }
.current { background: #eee; }
.pending { color: #999; }
.result { min-height: 23px; margin: 9px 0; font-size: 13px; }
button { background: #222; color: #fff; border: 0; border-radius: 4px; padding: 3px 9px; font: 750 10px/1.3 'Nunito', sans-serif; cursor: pointer; }
button:focus-visible { outline: 2px solid #777; outline-offset: 3px; }
@media print { button { display: none; } }
:global(html.print) button { display: none; }
button { display: inline-flex; align-items: center; justify-content: center; position: absolute; right: 8px; bottom: 8px; width: 10px; min-width: 10px; height: 10px; padding: 0; border-radius: 50%; font: 12px/1 Arial, sans-serif; }
button span { display: block; }
@media print { button { display: none; } }
:global(html.print) button { display: none; }
</style>
