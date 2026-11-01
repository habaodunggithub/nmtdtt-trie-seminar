<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import { createStudentLookupTrace, students } from '../lib/student-trie'
const { $page, $nav } = useSlideContext()
const ids = students.map(student => student.id)
const frames = createStudentLookupTrace()
const index = ref(-1)
const running = ref(false)
const foundIds = ref<string[]>([])
const frame = computed(() => frames[index.value])
const done = computed(() => index.value === frames.length - 1)
const status = computed(() => !frame.value ? ''
  : frame.value.matched ? `Tìm thấy ${frame.value.query}.`
    : frame.value.complete ? `Không tìm thấy ${frame.value.query}.` : `Đang tìm ${frame.value.query}…`)
let timer: ReturnType<typeof setTimeout> | undefined
function pause() { clearTimeout(timer); timer = undefined; running.value = false }
function show(next: number) {
  index.value = next
  const match = frames[next].matched
  if (match && !foundIds.value.includes(match.id)) foundIds.value = [...foundIds.value, match.id]
}
function schedule() {
  timer = setTimeout(() => {
    show(index.value + 1)
    if (done.value) pause()
    else schedule()
  }, frame.value?.matched ? 1800 : 450)
}
function reset() { pause(); index.value = -1; foundIds.value = [] }
function run() {
  if (running.value) { pause(); return }
  if (index.value < 0 || done.value) { reset(); show(0) }
  running.value = true
  schedule()
}
watch(() => $nav.value.currentPage, page => { if (page !== $page.value) reset() })
onBeforeUnmount(pause)
</script>
<template>
  <div class="cover-grid title-cover student-cover" :data-running="running" :data-complete="done" :data-query="frame?.query" @keydown.space.stop @keydown.enter.stop>
    <div>
      <div class="eyebrow">SEMINAR · NHẬP MÔN TƯ DUY THUẬT TOÁN</div>
      <h1 class="hero-title">Trie<span>Cây tiền tố</span></h1>
      <p class="hero-subtitle">Tổ chức dữ liệu theo tiền tố chung.</p>
      <ul class="student-roster" aria-label="Thành viên tìm thấy qua mã số sinh viên">
        <li v-for="student in students" :key="student.id" :data-student="student.id"
          :class="{ found: foundIds.includes(student.id), current: frame?.matched?.id === student.id }"
          :aria-hidden="!foundIds.includes(student.id)">
          <code>{{ student.id }}</code><span>{{ student.name }}</span>
        </li>
      </ul>
    </div>
    <div class="cover-diagram student-cover-diagram">
      <TrieDiagram :words="ids" :highlight="frame?.highlight ?? ''" :active-node="frame?.active ?? null" :height="340" />
      <div class="student-lookup-status" role="status" aria-live="polite" :aria-label="frame?.matched ? `${frame.matched.id} · ${frame.matched.name}` : status">{{ status }}</div>
      <button type="button" class="student-run" :aria-label="running ? 'Dừng' : done ? 'Chạy lại' : index >= 0 ? 'Tiếp tục' : 'Chạy thử'" :title="running ? 'Dừng' : done ? 'Chạy lại' : index >= 0 ? 'Tiếp tục' : 'Chạy thử'" @click.stop="run"></button>
    </div>
  </div>
</template>
<style scoped>
.title-cover .student-roster { padding: 0; list-style: none; margin: 18px 0 0; height: 108px; }
.student-roster li { display: flex; align-items: center; gap: 12px; margin: 0; padding: 3px 0; font-size: 15px; line-height: 1.4; visibility: hidden; opacity: 0; }
.student-roster li.found { visibility: visible; opacity: 1; }
.student-roster code { font-size: 12px; background: transparent; padding: 0; }
.student-roster .current span { font-weight: 850; }
.student-cover-diagram { position: relative; text-align: center; }
.student-lookup-status { display: flex; align-items: center; justify-content: center; min-height: 32px; margin: 4px 0 7px; font-size: 12px; line-height: 1.4; }
.student-run { padding: 3px 9px; background: #222; color: #fff; border: 1px solid #222; border-radius: 4px; font: 750 10px/1.3 'Nunito', sans-serif; cursor: pointer; }
.student-run:hover { background: #444; }
.student-run:focus-visible { outline: 2px solid #555; outline-offset: 3px; }
@media print { .student-run { display: none; } .student-roster li { visibility: visible; opacity: 1; } }
:global(html.print) .student-run { display: none; }
:global(html.print) .student-roster li { visibility: visible; opacity: 1; }
.student-run { display: inline-flex; align-items: center; justify-content: center; position: absolute; right: 8px; bottom: 8px; width: 10px; min-width: 10px; height: 10px; padding: 0; border-radius: 50%; font: 12px/1 Arial, sans-serif; }
.student-run span { display: block; }
@media print { .student-run { display: none; } }
:global(html.print) .student-run { display: none; }
</style>
