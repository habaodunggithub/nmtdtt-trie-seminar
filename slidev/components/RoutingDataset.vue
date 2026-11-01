<script setup lang="ts">
import { routingTable, ipBits } from '../lib/trie-demo'
const groups = [routingTable.slice(0, 12), routingTable.slice(12)]
</script>
<template>
  <div class="route-dataset">
    <div class="dataset-intro">24 tuyến IPv4 · Mỗi tiền tố bit được lưu từ node gốc.</div>
    <div class="dataset-columns">
      <table v-for="(routes, i) in groups" :key="i">
        <thead><tr><th>Tuyến</th><th>Tiền tố bit</th><th>Cổng</th></tr></thead>
        <tbody><tr v-for="route in routes" :key="route.port" :data-port="route.port">
          <td>{{ route.prefix }}/{{ route.length }}</td>
          <td class="route-bits">{{ ipBits(route.prefix).slice(0, route.length) || 'ε' }}</td>
          <td>{{ route.port }}</td>
        </tr></tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.dataset-intro { font-size: 17px; margin-bottom: 15px; }
.dataset-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.slidev-layout .dataset-columns table { font-size: 12px; line-height: 1.4; }
.slidev-layout .dataset-columns td, .slidev-layout .dataset-columns th { padding: 3px 6px; white-space: nowrap; }
.dataset-columns td.route-bits { font: 10px/1.4 'Noto Sans Mono', monospace; }
</style>
