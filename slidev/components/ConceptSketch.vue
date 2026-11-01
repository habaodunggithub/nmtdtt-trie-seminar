<script setup lang="ts">
import { useId } from 'vue'
const arrowId = `concept-${useId()}`
withDefaults(defineProps<{ type: 'memory' | 'depth' | 'rank' | 'route' | 'compress' | 'methods' | 'prefix', height?: number }>(), { height: 220 })
</script>
<template>
  <TreeSketch v-if="type === 'depth' || type === 'rank' || type === 'prefix' || type === 'compress'" :type="type" :height="height" />
  <svg v-else class="concept-sketch" :style="{height: `${height}px`}" :viewBox="type === 'methods' ? '0 0 480 215' : '0 0 480 270'" role="img" :aria-label="({memory:'26 ô liên kết và endCount của một node',depth:'Giới hạn số node theo từng độ sâu',rank:'Nhánh a có 3 từ, nhánh b có 2 từ',route:'Router chọn tuyến khớp tiền tố dài nhất',compress:'Nén chuỗi node một con',methods:'Mảng, bảng băm và Trie',prefix:'Các từ được gom vào cây con tiền tố ap'})[type]">
    <defs><marker :id="arrowId" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#202020;stroke:none" /></marker><marker :id="`${arrowId}-selected`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#2563eb;stroke:none" /></marker></defs>
    <g v-if="type === 'memory'">
      <text x="240" y="24" text-anchor="middle" class="label">MỘT NODE TRONG BỘ NHỚ</text>
      <rect x="30" y="53" width="420" height="82" rx="7" />
      <g v-for="i in 13" :key="i">
        <rect :x="30+(i-1)*32.3" y="53" width="32.3" height="41" :class="i===1 || i===2 ? 'filled' : ''" />
        <rect :x="30+(i-1)*32.3" y="94" width="32.3" height="41" />
      </g>
      <text x="46" y="80" text-anchor="middle" class="white">2</text><text x="78" y="80" text-anchor="middle" class="white">8</text>
      <text x="240" y="163" text-anchor="middle">26 ô liên kết a … z</text>
      <path d="M 240 176 Q 241 192 240 201" />
      <rect x="130" y="204" width="220" height="43" rx="5" /><text x="240" y="232" text-anchor="middle">+ 1 ô endCount</text>
    </g>
    <g v-else-if="type === 'route'">
      <rect x="14" y="102" width="142" height="52" rx="6" /><text x="85" y="125" text-anchor="middle" style="font-size:15px">192.168.1.42</text><text x="85" y="144" text-anchor="middle" class="tiny">IP đích</text>
      <path d="M 158 128 L 206 128 M 195 121 L 206 128 L 195 135" />
      <circle cx="245" cy="128" r="36" /><path d="M 223 128 H 267 M 245 106 V 150 M 260 121 L 267 128 L 260 135 M 238 113 L 245 106 L 252 113" />
      <path d="M 278 115 L 331 70" stroke-dasharray="5 5" :marker-end="`url(#${arrowId})`" /><path d="M 278 142 L 331 196" style="stroke:#2563eb" :marker-end="`url(#${arrowId}-selected)`" />
      <rect x="335" y="37" width="132" height="50" rx="7" /><text x="401" y="69" text-anchor="middle">/16 → A</text>
      <rect x="335" y="178" width="132" height="50" rx="7" class="filled" /><text x="401" y="210" text-anchor="middle" class="white">/24 → B ✓</text>
      <text x="240" y="267" text-anchor="middle">Khớp dài nhất → chọn tuyến B</text>
    </g>
    <g v-else-if="type === 'methods'">
      <text x="77" y="24" text-anchor="middle" class="label">MẢNG</text><text x="240" y="24" text-anchor="middle" class="label">HASH</text><text x="403" y="24" text-anchor="middle" class="label">TRIE</text>
      <g v-for="i in 4" :key="i"><rect x="31" :y="29+i*27" width="92" height="27" /><text x="77" :y="49+i*27" text-anchor="middle" class="tiny">{{ ['','ape','app','apple','bat'][i] }}</text></g>
      <path d="M 186 96 H 214 M 206 89 L 214 96 L 206 103" /><text x="185" y="73" class="label">#</text>
      <rect x="223" y="50" width="59" height="105" rx="4" /><path d="M 223 85 H 282 M 223 120 H 282" /><circle cx="252" cy="102" r="9" class="filled" />
      <g :marker-end="`url(#${arrowId})`"><path d="M 392 63 L 372 98" /><path d="M 409 62 L 431 99" /><path d="M 359 124 L 348 151" /><path d="M 370 123 L 384 151" /></g>
      <g v-for="(p,i) in [[400,52],[364,111],[440,111],[343,165],[390,165]]" :key="i"><circle :cx="p[0]" :cy="p[1]" r="12" /></g>
      <text x="77" y="202" text-anchor="middle" class="tiny">có thứ tự</text><text x="240" y="202" text-anchor="middle" class="tiny">khóa chính xác</text><text x="403" y="202" text-anchor="middle" class="tiny">chung tiền tố</text>
    </g>
  </svg>
</template>
<style scoped>
.concept-sketch { width:100%; overflow:visible; }
.concept-sketch :is(rect,circle) { fill:white; stroke:#252421; stroke-width:1.8; }
.concept-sketch path { fill:none; stroke:#252421; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
.concept-sketch .filled { fill:#252421; }
.concept-sketch text { font: 19px 'Nunito',sans-serif; fill:#252421; }
.concept-sketch .label { font-weight:800; }
.concept-sketch .white { fill:white; }
.concept-sketch .tiny { font-size:14px; }
</style>
