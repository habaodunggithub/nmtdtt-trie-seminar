<script setup lang="ts">
defineProps<{ mode: 'insert' | 'search' | 'delete' }>()
</script>
<template><TrieRun :mode="mode" /></template>
