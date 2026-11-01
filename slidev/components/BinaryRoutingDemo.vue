<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { buildRoutingTrie, ipBits, routingTable, traceRouting } from '../lib/trie-demo'
import type { RoutingNode } from '../lib/trie-demo'
const { $page, $nav } = useSlideContext()
const id = `binary-route-${useId()}`
const target = ref('192.168.1.42')
const targets = ['192.168.1.42', '192.168.1.43', '192.168.2.7', '10.1.2.7', '8.8.8.8']
const bits = computed(() => ipBits(target.value))
const frames = computed(() => traceRouting(target.value))
const index = ref(0)
const frame = computed(() => frames.value[index.value])
const running = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const done = computed(() => frame.value.done)
const width = 864, height = 220
const nodes: { key: string; x: number; y: number; port?: string; cidr?: string }[] = []
function collect(node: RoutingNode) {
  nodes.push({ key: node.key, x: 34 + node.key.length * 62, y: 0, port: node.route?.port,
    cidr: node.route ? `${node.route.prefix}/${node.route.length}` : undefined })
  for (const child of node.children.values()) collect(child)
}
collect(buildRoutingTrie())
for (let depth = 0; depth <= 32; depth++) {
  const level = nodes.filter(node => node.key.length === depth).sort((a, b) => a.key.localeCompare(b.key))
  level.forEach((node, i) => { node.y = 160 + (i - (level.length - 1) / 2) * 46 })
}
const edges = nodes.filter(node => node.key).map(to => {
  const from = nodes.find(node => node.key === to.key.slice(0, -1))!
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy)
  return { from, to, bit: to.key.at(-1), x1: from.x + dx / length * 13, y1: from.y + dy / length * 13,
    x2: to.x - dx / length * 14, y2: to.y - dy / length * 14,
    labelX: (from.x + to.x) / 2 - dy / length * 9, labelY: (from.y + to.y) / 2 + dx / length * 9 + 4 }
})
const current = computed(() => nodes.find(node => node.key === frame.value.key)!)
const minY = Math.min(...nodes.map(node => node.y)) - 26
const maxY = Math.max(...nodes.map(node => node.y)) + 26
const maxX = Math.max(...nodes.map(node => node.x)) + 30
function clampCamera(x: number, y: number) {
  return { x: Math.max(0, Math.min(maxX - width, x)), y: Math.max(minY, Math.min(maxY - height, y)) }
}
const manualCamera = ref<{ x: number; y: number } | null>(null)
const camera = computed(() => manualCamera.value ?? clampCamera(current.value.x - width * .65, current.value.y - height / 2))
const bestNode = computed(() => frame.value.best ? ipBits(frame.value.best.prefix).slice(0, frame.value.best.length) : null)
function pause() { clearTimeout(timer); running.value = false }
function schedule() {
  timer = setTimeout(() => {
    index.value++
    if (done.value) pause()
    else schedule()
  }, 450)
}
function run() {
  if (running.value) { pause(); return }
  if (done.value) index.value = 0
  manualCamera.value = null
  running.value = true
  schedule()
}
function step() {
  if (!done.value && !running.value) { manualCamera.value = null; index.value++ }
}
function reset() { pause(); index.value = 0; manualCamera.value = null }
watch(target, reset)
watch(() => $nav.value.currentPage, page => { if (page !== $page.value) reset() })
onBeforeUnmount(pause)
let drag: { x: number; y: number; cameraX: number; cameraY: number; scale: number } | null = null
function startDrag(event: PointerEvent) {
  if (event.button !== 0) return
  pause()
  const svg = event.currentTarget as SVGSVGElement
  drag = { x: event.clientX, y: event.clientY, cameraX: camera.value.x, cameraY: camera.value.y,
    scale: width / svg.getBoundingClientRect().width }
  svg.setPointerCapture(event.pointerId)
}
function moveDrag(event: PointerEvent) {
  if (!drag) return
  manualCamera.value = clampCamera(drag.cameraX - (event.clientX - drag.x) * drag.scale,
    drag.cameraY - (event.clientY - drag.y) * drag.scale)
}
function stopDrag() { drag = null }
</script>
<template>
  <div class="binary-routing" :data-running="running" :data-complete="done" :data-bit-index="frame.examined" :data-best-port="frame.best?.port" @keydown.space.stop @keydown.enter.stop>
    <div class="routing-topline">
      <label>IP đích <select v-model="target" aria-label="Chọn IP đích"><option v-for="ip in targets" :key="ip">{{ ip }}</option></select></label>
      <span>{{ routingTable.length }} tuyến · {{ nodes.length }} node · Mỗi cạnh = 1 bit</span>
    </div>
    <div class="routing-bit-strip" aria-label="Địa chỉ IP ở dạng 32 bit">
      <span v-for="(bit, i) in bits" :key="i" :data-bit="i + 1" :class="{ read: i < frame.bitsRead, current: frame.examined > 0 && i === frame.examined - 1, failed: frame.missing && i === frame.examined - 1, octet: i % 8 === 0 && i > 0 }">{{ bit }}</span>
    </div>
    <div class="routing-state">
      <span>Đã đi {{ frame.bitsRead }} cạnh · Đã xét {{ frame.examined }}/32 bit</span>
      <span>Tốt nhất: <strong>{{ frame.best ? `${frame.best.prefix}/${frame.best.length} → ${frame.best.port}` : 'chưa có' }}</strong></span>
    </div>
    <div class="routing-diagram">
    <svg class="routing-canvas" :viewBox="`0 0 ${width} ${height}`" role="img" aria-label="Binary Trie đầy đủ: mỗi cạnh mang đúng một bit 0 hoặc 1; kéo để xem các nhánh" @pointerdown.stop="startDrag" @pointermove="moveDrag" @pointerup="stopDrag" @pointercancel="stopDrag" @click.stop>
      <defs><marker v-for="(color, key) in { selected: '#222', other: '#bbb' }" :id="`${id}-${key}`" :key="key" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" :fill="color" /></marker></defs>
      <g :transform="`translate(${-camera.x}, ${-camera.y})`" class="routing-camera" :class="{ dragging: manualCamera }" :data-camera-x="camera.x" :data-camera-y="camera.y">
        <g v-for="edge in edges" :key="edge.to.key" :data-route-edge="edge.to.key" :data-parent="edge.from.key" :data-label="edge.bit">
          <line :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2" :stroke="frame.key.startsWith(edge.to.key) ? '#222' : '#bbb'" stroke-width="1.8" :marker-end="`url(#${id}-${frame.key.startsWith(edge.to.key) ? 'selected' : 'other'})`" />
          <text :x="edge.labelX" :y="edge.labelY" text-anchor="middle" class="binary-edge-label">{{ edge.bit }}</text>
        </g>
        <g v-for="node in nodes" :key="node.key" :data-route-node="node.key" :data-port="node.port" :data-active="node.key === frame.key">
          <title>{{ node.cidr ? `${node.cidr} → ${node.port}` : `Tiền tố ${node.key || 'ε'}` }}</title>
          <circle v-if="bestNode === node.key" :cx="node.x" :cy="node.y" r="17" fill="#fff" stroke="#222" stroke-width="1" />
          <circle :cx="node.x" :cy="node.y" r="11" :fill="node.key === frame.key ? '#222' : '#fff'" stroke="#222" stroke-width="1.8" />
          <text v-if="node.port" :x="node.x" :y="node.y + 4" text-anchor="middle" :fill="node.key === frame.key ? '#fff' : '#222'" class="binary-port-label">{{ node.port }}</text>
        </g>
      </g>
    </svg>
      <button type="button" class="routing-run" :aria-label="running ? 'Dừng' : done ? 'Chạy lại' : index > 0 ? 'Tiếp tục' : 'Chạy thử'" :title="running ? 'Dừng' : done ? 'Chạy lại' : index > 0 ? 'Tiếp tục' : 'Chạy thử'" @click.stop="run"></button>
    </div>
    <div class="routing-controls">

      <button type="button" :disabled="running || done" @click.stop="step">Bước tiếp</button>
      <div class="routing-status" role="status" aria-live="polite">{{ frame.status }}</div>
      <button type="button" @click.stop="manualCamera = null">Theo node</button>
    </div>
    <div class="routing-help">Node có chữ = cổng ra · Vòng ngoài = tuyến tốt nhất · Kéo sơ đồ để xem nhánh khác</div>
  </div>
</template>
<style scoped>
.routing-diagram { position: relative; }
.routing-topline { display: flex; justify-content: space-between; align-items: center; font-size: 15px; margin-bottom: 8px; }
.routing-topline > span { font-size: 12px; color: #666; }
select { margin-left: 8px; padding: 3px 8px; background: #fff; border: 1px solid #aaa; border-radius: 4px; color: #222; font: 750 14px 'Nunito', sans-serif; }
.routing-bit-strip { display: flex; align-items: center; justify-content: center; margin: 0 0 7px; font: 14px/23px 'Noto Sans Mono', monospace; }
.routing-bit-strip > span { display: inline-block; width: 18px; text-align: center; color: #777; }
.routing-bit-strip .octet { margin-left: 12px; }
.routing-bit-strip .read { color: #222; }
.routing-bit-strip .current { background: #222; color: #fff; border-radius: 3px; }
.routing-bit-strip .failed { outline: 1px dashed #222; background: #eee; color: #222; }
.routing-state { display: flex; justify-content: space-between; gap: 20px; font-size: 12px; margin-bottom: 8px; }
.routing-canvas { display: block; width: 100%; height: 220px; border: 1.5px solid #625d54; border-radius: 7px; background: #fff; overflow: hidden; touch-action: none; cursor: grab; }
.routing-canvas:active { cursor: grabbing; }
.routing-camera { transition: transform .16s ease; }
.routing-camera.dragging { transition: none; }
.binary-edge-label { font: 750 12px 'Noto Sans Mono', monospace; fill: #333; paint-order: stroke; stroke: #fff; stroke-width: 4px; }
.binary-port-label { font: 800 11px 'Nunito', sans-serif; }
.routing-controls { display: flex; align-items: center; gap: 8px; margin-top: 9px; }
.routing-controls button { padding: 3px 9px; border: 1px solid #aaa; border-radius: 4px; background: #fff; color: #222; font: 750 10px/1.3 'Nunito', sans-serif; cursor: pointer; white-space: nowrap; }
.routing-run { color: #fff; background: #222; border: 1px solid #222; cursor: pointer; }
.routing-controls button:disabled { opacity: .4; cursor: default; }
.routing-controls button:focus-visible, select:focus-visible { outline: 2px solid #555; outline-offset: 2px; }
.routing-status { flex: 1; min-width: 0; font-size: 12px; line-height: 1.35; }
.routing-help { color: #666; font-size: 10px; text-align: right; margin-top: 5px; }
@media print { .routing-controls button, .routing-help { display: none; } }
:global(html.print) .routing-controls button, :global(html.print) .routing-help { display: none; }
.routing-run { display: inline-flex; align-items: center; justify-content: center; position: absolute; right: 8px; bottom: 8px; width: 10px; min-width: 10px; height: 10px; padding: 0; border-radius: 50%; font: 12px/1 Arial, sans-serif; }
.routing-run span { display: block; }
@media print { .routing-run { display: none; } }
:global(html.print) .routing-run { display: none; }
</style>
