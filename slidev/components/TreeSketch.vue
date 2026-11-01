<script setup lang="ts">
import { computed, useId } from 'vue'
const props = defineProps<{ type: 'depth' | 'rank' | 'prefix' | 'compress', height: number }>()
const id = useId()
type Node = { id: string, x: number, y: number, label: string, r?: number, terminal?: boolean }
type Edge = { from: string, to: string, label?: string, dashed?: boolean }
type Note = { text: string, x: number, y: number, toX: number, toY: number, color: 'blue' | 'red', anchor?: string }
const chart = computed((): { nodes: Node[], edges: Edge[], notes: Note[], title: string, footer?: string } => {
  if (props.type === 'depth') return {
    title: 'Giới hạn số node theo từng độ sâu',
    nodes: [{id:'root',x:215,y:40,label:'ε'}, {id:'a',x:110,y:112,label:'a'}, {id:'z',x:320,y:112,label:'z'}, ...['aa','az','za','zz'].map((label,i)=>({id:label,x:55+i*105,y:190,label,r:23}))],
    edges: [{from:'root',to:'a'}, {from:'root',to:'z'}, ...['aa','az','za','zz'].map((to,i)=>({from:i<2?'a':'z',to}))],
    notes: [{text:'Gốc',x:310,y:24,toX:241,toY:38,color:'blue'}, {text:'Tầng 1',x:424,y:112,toX:347,toY:112,color:'blue'}],
    footer: 'Mỗi tầng: các tiền tố khác nhau',
  }
  if (props.type === 'prefix') return {
    title: 'Cây con tiền tố ap: ape, app, apple',
    nodes: [{id:'ap',x:240,y:40,label:'ap',r:25}, {id:'ape',x:100,y:116,label:'ape',terminal:true,r:27}, {id:'app',x:300,y:116,label:'app',terminal:true,r:27}, {id:'appl',x:300,y:188,label:'appl',r:27}, {id:'apple',x:300,y:261,label:'apple',terminal:true,r:30}],
    edges: [{from:'ap',to:'ape',label:'e'}, {from:'ap',to:'app',label:'p'}, {from:'app',to:'appl',label:'l'}, {from:'appl',to:'apple',label:'e'}],
    notes: [{text:'passCount = 3',x:385,y:27,toX:273,toY:38,color:'red'}, {text:'Kết thúc từ',x:82,y:199,toX:100,toY:148,color:'blue'}],
  }
  if (props.type === 'rank') return {
    title: 'Nhóm từ theo ký tự đầu: nhánh a có 3 từ, nhánh b có 2 từ',
    nodes: [{id:'root',x:239,y:35,label:'ε'}, {id:'a',x:138,y:112,label:'a'}, {id:'b',x:365,y:112,label:'b'}, ...['ape','app','apple','bat','bath'].map((label,i)=>({id:label,x:[43,139,237,337,437][i],y:218,label,r:29,terminal:true}))],
    edges: [{from:'root',to:'a'}, {from:'root',to:'b'}, ...['ape','app','apple','bat','bath'].map((to,i)=>({from:i<3?'a':'b',to}))],
    notes: [{text:'3 từ',x:61,y:105,toX:110,toY:110,color:'blue'}, {text:'2 từ',x:430,y:105,toX:393,toY:110,color:'blue'}, {text:'k = 3',x:240,y:287,toX:237,toY:252,color:'red'}],
  }
  return {
    title: 'Nén đường đi chỉ có một con thành một cạnh mang xâu apple',
    nodes: [...Array.from({length:6},(_,i)=>({id:`n${i}`,x:35+i*81,y:78,label:i===0?'ε':'',r:17,terminal:i===5})), {id:'start',x:80,y:237,label:'ε'}, {id:'end',x:400,y:237,label:'',terminal:true}],
    edges: [...['a','p','p','l','e'].map((label,i)=>({from:`n${i}`,to:`n${i+1}`,label})), {from:'start',to:'end',label:'apple'}],
    notes: [{text:'Nén đường đi',x:240,y:151,toX:240,toY:189,color:'blue'}],
  }
})
const edges = computed(() => chart.value.edges.map(edge => {
  const from = chart.value.nodes.find(n=>n.id===edge.from)!, to = chart.value.nodes.find(n=>n.id===edge.to)!
  const dx=to.x-from.x, dy=to.y-from.y, len=Math.hypot(dx,dy)
  return {...edge,x1:from.x+dx/len*((from.r||22)+2),y1:from.y+dy/len*((from.r||22)+2),x2:to.x-dx/len*((to.r||22)+3),y2:to.y-dy/len*((to.r||22)+3),labelX:(from.x+to.x)/2+dy/len*13,labelY:(from.y+to.y)/2-dx/len*13+4}
}))
</script>
<template>
  <svg class="tree-sketch" :style="{height:`${height}px`}" viewBox="0 0 480 305" role="img" :aria-label="chart.title">
    <defs><marker v-for="(color,name) in {black:'#202020',blue:'#6399e8',red:'#d98989'}" :key="name" :id="`${id}-${name}`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" :fill="color" /></marker></defs>
    <g v-for="(edge,i) in edges" :key="i">
      <line :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2" stroke="#202020" stroke-width="1.8" :marker-end="`url(#${id}-black)`" />
      <text v-if="edge.label" :x="edge.labelX" :y="edge.labelY" text-anchor="middle" class="edge-label">{{edge.label}}</text>
    </g>
    <g v-for="node in chart.nodes" :key="node.id">
      <circle :cx="node.x" :cy="node.y" :r="node.r||22" fill="white" stroke="#202020" stroke-width="2" />
      <circle v-if="node.terminal" :cx="node.x" :cy="node.y" :r="(node.r||22)-4" fill="none" stroke="#202020" stroke-width="1" />
      <text :x="node.x" :y="node.y+6" text-anchor="middle" class="node-label">{{node.label}}</text>
    </g>
    <g v-for="(note,i) in chart.notes" :key="i">
      <text :x="note.x" :y="note.y" text-anchor="middle" class="note-label">{{note.text}}</text>
      <path :d="`M ${note.x} ${note.toY < note.y ? note.y-19 : note.y+7} Q ${(note.x+note.toX)/2} ${note.toY < note.y ? note.y-25 : note.y+20} ${note.toX} ${note.toY}`" fill="none" :stroke="note.color==='blue'?'#6399e8':'#d98989'" stroke-width="1.7" :marker-end="`url(#${id}-${note.color})`" />
    </g>
    <g v-if="type==='depth'"><text x="214" y="115" text-anchor="middle" class="node-label">…</text><text x="214" y="273" text-anchor="middle" class="footer-label">{{chart.footer}}</text></g>
    <text v-if="type==='rank'" x="98" y="289" text-anchor="middle" class="subtitle">Nhóm theo ký tự đầu</text>
  </svg>
</template>
<style scoped>
.tree-sketch { width:100%; overflow:visible; }
.node-label { font:19px 'Nunito',sans-serif; fill:#202020; }
.edge-label { font:600 18px 'Nunito',sans-serif; fill:#202020; paint-order:stroke; stroke:white; stroke-width:5px; stroke-linejoin:round; }
.note-label { font:700 16px 'Nunito',sans-serif; fill:#303030; }
.footer-label { font:800 20px 'Nunito',sans-serif; fill:#202020; }
.subtitle { font:600 13px 'Nunito',sans-serif; fill:#716d66; }
</style>
