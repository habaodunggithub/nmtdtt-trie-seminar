<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { createTrace, defaultWords } from '../lib/trie-demo'
import type { DemoFrame, DemoMode } from '../lib/trie-demo'
const props = withDefaults(defineProps<{ mode: DemoMode; words?: string[]; query?: string; k?: number; height?: number; showNodeCount?: boolean; stepMs?: number }>(), { height: 235, stepMs: 1000 })
const arrowId = `run-${useId()}`
const { $page, $nav } = useSlideContext()
const baseWords = computed(() => props.words ?? defaultWords(props.mode))
const frames = ref<DemoFrame[]>([])
const index = ref(-1)
const running = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const done = computed(() => index.value >= 0 && index.value === frames.value.length - 1)
const readyText = computed(() => ({
  walk: `Duyệt đường ${props.query ?? 'app'}.`, prefix: `Kiểm tra tiền tố ${props.query ?? 'app'}.`,
  search: `Tìm từ ${props.query ?? 'app'}.`, insert: `Chèn ${props.query ?? 'apple'}.`, delete: 'Xóa từng lần xuất hiện của app.',
  count: `Đếm từ có tiền tố ${props.query ?? 'ap'}.`, update: `Chèn ${props.query ?? 'app'}, cập nhật bộ đếm.`,
  enumerate: props.query ? `Liệt kê từ có tiền tố ${props.query}.` : 'Liệt kê theo thứ tự từ điển.',
  kth: `Tìm từ thứ ${props.k ?? 3}.`, lcp: 'Tìm tiền tố chung dài nhất.', xor: 'Tìm XOR lớn nhất với 6.',
  aho: `Quét văn bản “${props.query ?? 'ushers'}”.`, build: props.showNodeCount ? `Chèn ${baseWords.value.join(', ')}.` : 'Chèn từng từ và đếm node.', route: 'Tra IP 192.168.1.42.', compress: 'Nén đường đi của apple.',
}[props.mode]))
const frame = computed<DemoFrame>(() => frames.value[index.value] ?? {
  words: baseWords.value, topology: baseWords.value, active: null, highlight: '', output: [], text: readyText.value,
})
const nodeCount = computed(() => {
  const prefixes = new Set([''])
  for (const word of [...frame.value.topology, ...frame.value.words]) {
    for (let i = 1; i <= word.length; i++) prefixes.add(word.slice(0, i))
  }
  return prefixes.size
})
const maximumLength = computed(() => Math.max(0, ...baseWords.value.map(word => word.length)))
const simpleBound = computed(() => 1 + baseWords.value.length * maximumLength.value)
const layoutWords = computed(() => [...baseWords.value, ...(['insert', 'update'].includes(props.mode) ? [props.query ?? (props.mode === 'insert' ? 'apple' : 'app')] : [])])
const valueMode = computed(() => ['count', 'update', 'kth'].includes(props.mode) ? 'pass' : 'end')
const segments = computed(() => frame.value.segments ?? [...(baseWords.value[0] ?? 'apple')])
function pause() { clearTimeout(timer); timer = undefined; running.value = false }
function schedule() {
  timer = setTimeout(() => {
    if (index.value < frames.value.length - 1) index.value++
    if (done.value) pause()
    else schedule()
  }, props.stepMs)
}
function run() {
  if (running.value) { pause(); return }
  if (index.value < 0 || done.value) {
    frames.value = createTrace({ mode: props.mode, words: [...baseWords.value], query: props.query, k: props.k })
    index.value = 0
  }
  if (!done.value) { running.value = true; schedule() }
}
function reset() { pause(); frames.value = []; index.value = -1 }
watch(() => $nav.value.currentPage, page => { if (page !== $page.value) reset() })
watch(() => [props.mode, props.words, props.query, props.k], reset)
onBeforeUnmount(pause)
</script>

<template>
  <div class="trie-run" :data-demo="mode" :data-running="running" :data-complete="done" @keydown.space.stop @keydown.enter.stop>
    <svg v-if="mode === 'compress'" viewBox="0 0 420 310" :style="{ height: `${height}px` }" role="img" aria-label="Nén chuỗi cạnh apple thành một cạnh">
      <defs><marker :id="arrowId" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#222" /></marker></defs>
      <g v-for="(segment, i) in segments" :key="i">
        <line x1="130" :y1="32 + i * 242 / segments.length + 18" x2="130" :y2="32 + (i + 1) * 242 / segments.length - 18" stroke="#222" stroke-width="1.8" :marker-end="`url(#${arrowId})`" />
        <text x="160" :y="38 + (i + 0.5) * 242 / segments.length" fill="#222" data-segment>{{ segment }}</text>
      </g>
      <g v-for="(_, i) in [...segments, '']" :key="i">
        <circle cx="130" :cy="32 + i * 242 / segments.length" r="18" fill="#fff" stroke="#222" stroke-width="1.8" />
        <circle v-if="i === segments.length" cx="130" :cy="32 + i * 242 / segments.length" r="14" fill="none" stroke="#222" stroke-width="1" />
        <text x="130" :y="38 + i * 242 / segments.length" text-anchor="middle" fill="#222">{{ i === 0 ? 'ε' : i === segments.length ? '1' : '0' }}</text>
      </g>
    </svg>
    <TrieDiagram v-else :words="frame.words" :topology-words="frame.topology" :layout-words="layoutWords" :highlight="frame.highlight" :active-node="frame.active" :height="height" :value-mode="valueMode" :failure="mode === 'aho'" :failure-active="frame.failureActive" :pass-values="frame.passValues" />
    <div v-if="showNodeCount" class="run-node-comparison">
      <div>Cận: 1 + {{ baseWords.length }} × {{ maximumLength }} = <strong>{{ simpleBound }} node</strong></div>
      <div>Đếm trên cây: <strong data-node-count>{{ nodeCount }} node</strong></div>
    </div>
    <div class="run-status" :class="{ 'run-status-muted': showNodeCount && done }" role="status" aria-live="polite">{{ showNodeCount && done ? 'Chung tiền tố → dùng chung node.' : frame.text }}</div>
    <button type="button" class="run-button" :aria-label="running ? 'Dừng demo' : done ? 'Chạy lại demo' : index >= 0 ? 'Tiếp tục demo' : 'Chạy thử demo'" :title="running ? 'Dừng demo' : done ? 'Chạy lại demo' : index >= 0 ? 'Tiếp tục demo' : 'Chạy thử demo'" @click.stop="run"></button>
    <div v-if="valueMode === 'pass'" class="run-legend">Số trong node: passCount</div>
  </div>
</template>

<style scoped>
.trie-run { text-align: center; }
.trie-run > svg { width: 100%; overflow: visible; font: 18px 'Nunito', sans-serif; }
.run-status { display: flex; align-items: center; justify-content: center; min-height: 38px; margin: 7px 0; font: 750 13px/1.4 'Nunito', sans-serif; }
.run-status-muted { color: #666; font-weight: 600; }
.run-button { padding: 3px 9px; border: 1px solid #222; border-radius: 4px; background: #222; color: #fff; font: 750 10px/1.3 'Nunito', sans-serif; cursor: pointer; }
.run-button:hover { background: #444; }
.run-button:focus-visible { outline: 2px solid #555; outline-offset: 3px; }
.run-node-comparison { margin-top: 8px; font-size: 13px; line-height: 1.6; }
.run-legend { margin-top: 6px; font-size: 10px; color: #666; }
@media print { .run-button { display: none; } }
:global(html.print) .run-button { display: none; }
.run-button { display: inline-flex; align-items: center; justify-content: center; position: absolute; right: 8px; bottom: 8px; width: 10px; min-width: 10px; height: 10px; padding: 0; border-radius: 50%; font: 12px/1 Arial, sans-serif; }
.run-button span { display: block; }
@media print { .run-button { display: none; } }
:global(html.print) .run-button { display: none; }
</style>
