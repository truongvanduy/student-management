<script setup>
import studentService from '@/services/student.service'
import { onMounted, ref } from 'vue'

const student = ref({})

onMounted(async () => {
  
  student.value = await studentService.get('1')
})
</script>

<template>
  <h1 class="fs-1">Thông tin học sinh</h1>
  <div class="student">
    <p class="student-item">
      <strong>Họ và tên: </strong>
      <span>{{ student.lastName + ' ' + student.firstName }}</span>
    </p>
    <p class="student-item">
      <strong>Ngày sinh: </strong>
      <span>{{ student.dateOfBirth }}</span>
    </p>
    <p class="student-item">
      <strong>Địa chỉ: </strong>
      <span>{{ student.address }}</span>
    </p>
  </div>
</template>
