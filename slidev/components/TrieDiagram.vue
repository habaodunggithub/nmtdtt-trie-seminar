<script setup lang="ts">
import { computed, useId } from 'vue'
const id = useId()
const props = withDefaults(defineProps<{ collapsedPrefix?: string, words?: string[], highlight?: string, failure?: boolean, height?: number, newPrefix?: string, caption?: boolean, topologyWords?: string[], layoutWords?: string[], activeNode?: string | null, valueMode?: 'end' | 'pass', failureActive?: boolean, passValues?: Record<string, number> }>(), {
  words: () => ['app', 'apple', 'ape', 'bat', 'bath'], highlight: '', failure: false, height: 265, newPrefix: '', caption: false, topologyWords: () => [], layoutWords: () => [], activeNode: null, valueMode: 'end', failureActive: false,
})
type Node = { key: string, char: string, x: number, y: number, end: number, pass: number }
const radius = 24
const diagram = computed(() => {
  let nodes: Node[] = [{ key: '', char: '', x: 0, y: 58, end: 0, pass: 0 }]
  const visibleKeys = new Set([''])
  for (const word of [...props.topologyWords, ...props.words]) {
    for (let i = 1; i <= word.length; i++) visibleKeys.add(word.slice(0, i))
  }
  for (const word of [...props.layoutWords, ...props.topologyWords, ...props.words]) {
    for (let i = 1; i <= word.length; i++) {
      const key = word.slice(0, i)
      if (!nodes.some(n => n.key === key)) nodes.push({ key, char: word[i - 1], x: 0, y: 58 + i * 72, end: 0, pass: 0 })
    }
  }
  for (const word of props.words) {
    nodes[0].pass++
    for (let i = 1; i <= word.length; i++) nodes.find(n => n.key === word.slice(0, i))!.pass++
    nodes.find(n => n.key === word)!.end++
  }
  if (props.passValues) {
    for (const node of nodes) node.pass = props.passValues[node.key] ?? node.pass
  }
  const collapsed = props.collapsedPrefix ?? ''
  if (collapsed) {
    nodes = nodes.filter(n => !n.key || !collapsed.startsWith(n.key) || n.key.length >= collapsed.length)
    for (const node of nodes) {
      node.y = 58 + Math.max(0, node.key.length - (collapsed.length - 1)) * 72
      if (node.key === collapsed) node.char = collapsed
    }
  }
  const parentKey = (key: string) => key === collapsed ? '' : key.slice(0, -1)
  let leaf = 0
  function position(key: string): number {
    const node = nodes.find(n => n.key === key)!
    const children = nodes
      .filter(n => n.key !== '' && parentKey(n.key) === key)
      .sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0))
    node.x = children.length ? children.map(n => position(n.key)).reduce((a, b) => a + b, 0) / children.length : 42 + leaf++ * 108
    return node.x
  }
  position('')
  const edges = nodes.filter(n => n.key).map(to => {
    const from = nodes.find(p => p.key === parentKey(to.key))!
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy)
    return { from, to, x1: from.x + dx / length * (radius + 2), y1: from.y + dy / length * (radius + 2), x2: to.x - dx / length * (radius + 3), y2: to.y - dy / length * (radius + 3), labelX: (from.x + to.x) / 2 + dy / length * 14, labelY: (from.y + to.y) / 2 - dx / length * 14 + 5 }
  })
  return { nodes: nodes.filter(n => visibleKeys.has(n.key)), edges: edges.filter(e => visibleKeys.has(e.to.key)), root: nodes[0], width: Math.max(150, (leaf - 1) * 108 + 84), height: Math.max(...nodes.map(n => n.y)) + 47 }
})
const failurePath = computed(() => {
  const from = diagram.value.nodes.find(n => n.key === 'she')
  const to = diagram.value.nodes.find(n => n.key === 'he')
  if (!from || !to) return ''
  return `M ${from.x - 15} ${from.y + 22} Q ${diagram.value.width / 2} ${diagram.value.height + 8} ${to.x + 10} ${to.y + 26}`
})
</script>

<template>
  <figure class="trie-figure">
    <svg :viewBox="`0 0 ${diagram.width} ${diagram.height}`" :style="{ height: `${height}px` }" role="img" :aria-label="`Cây Trie chứa: ${words.join(', ')}`">
      <defs>
        <marker v-for="(color, name) in { edge: '#202020', selected: '#2563eb', note: '#6399e8', failure: '#d98989' }" :id="`${id}-${name}`" :key="name" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" :fill="color" /></marker>
      </defs>
      <text :x="diagram.root.x" y="15" text-anchor="middle" class="annotation">Gốc</text>
      <path :d="`M ${diagram.root.x} 22 L ${diagram.root.x} 31`" class="note-arrow" :marker-end="`url(#${id}-note)`" />
      <g v-for="edge in diagram.edges" :key="edge.to.key" :data-prefix="edge.to.key">
        <line :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2" :stroke="highlight.startsWith(edge.to.key) ? '#2563eb' : '#202020'" stroke-width="1.8" :stroke-dasharray="newPrefix && edge.to.key.startsWith(newPrefix) ? '5 4' : undefined" :marker-end="`url(#${id}-${highlight.startsWith(edge.to.key) ? 'selected' : 'edge'})`" />
        <text :x="edge.labelX" :y="edge.labelY" text-anchor="middle" class="edge-label" :style="{ fill: highlight.startsWith(edge.to.key) ? '#2563eb' : undefined }">{{ edge.to.char }}</text>
      </g>
      <g v-for="node in diagram.nodes" :key="node.key" :data-node="node.key" :data-active="activeNode === node.key" :data-end="node.end" :data-pass="node.pass">
        <circle :cx="node.x" :cy="node.y" :r="radius" :fill="activeNode === node.key ? '#202020' : '#fff'" stroke="#202020" stroke-width="2" />
        <circle v-if="node.end" :cx="node.x" :cy="node.y" :r="radius - 4" fill="none" :stroke="activeNode === node.key ? '#fff' : '#202020'" stroke-width="1" />
        <text :x="node.x" :y="node.y + 6" text-anchor="middle" class="node-label" :class="{ compact: node.key === collapsedPrefix }" :style="{ fill: activeNode === node.key ? '#fff' : undefined }">{{ node.key === collapsedPrefix ? collapsedPrefix : node.key ? (valueMode === 'pass' ? node.pass : node.end) : 'ε' }}</text>
      </g>
      <g v-if="failure && failurePath">
        <path :d="failurePath" class="failure-arrow" :class="{ 'failure-active': failureActive }" :marker-end="`url(#${id}-${failureActive ? 'edge' : 'failure'})`" />
        <text :x="diagram.width / 2" :y="diagram.height - 3" text-anchor="middle" class="failure-label">fail: she → he</text>
      </g>
    </svg>
    <figcaption v-if="caption">Vòng kép: kết thúc từ · Số trong node: endCount</figcaption>
  </figure>
</template>

<style scoped>
.trie-figure { margin: 0; text-align: center; }
svg { width: 100%; overflow: visible; }
.edge-label { font: 600 18px 'Nunito', sans-serif; fill: #202020; paint-order: stroke; stroke: white; stroke-width: 4px; stroke-linejoin: round; }
.node-label { font: 23px 'Nunito', sans-serif; fill: #202020; }
.node-label.compact { font-size: 16px; font-weight: 700; }
.annotation { font: 700 16px 'Nunito', sans-serif; fill: #303030; }
.note-arrow { fill: none; stroke: #6399e8; stroke-width: 1.8; }
.failure-arrow { fill: none; stroke: #d98989; stroke-width: 2; stroke-dasharray: 6 4; }
.failure-arrow.failure-active { stroke: #202020; }
.failure-label { font: 600 15px 'Nunito', sans-serif; fill: #b36565; }
figcaption { font-size: 12px; color: #716d66; margin-top: 10px; }
</style>
