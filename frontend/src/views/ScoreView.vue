<script setup>
import studentService from '@/services/student.service'
import { onMounted, ref } from 'vue'

const student = ref({})

onMounted(async () => {
  student.value = await studentService.get('1')
})
</script>

<template>
  <h1 class="fs-1">Điểm số</h1>
</template>
