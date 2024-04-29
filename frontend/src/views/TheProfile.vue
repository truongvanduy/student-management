<script setup>
import { onMounted, ref } from 'vue'
import InfoGroup from '../components/profiles/InfoGroup.vue'
import userService from '@/services/user.service'
import { translate } from '@/utils/translator.util'

const student = ref({})
const basicInfo = ref([])
const contactInfo = ref([])

onMounted(async () => {
  try {
    const { id } = JSON.parse(localStorage.getItem('user'))
    student.value = await userService.getProfile(id)
    console.log(student.value)

    basicInfo.value = [
      { key: 'Họ và tên', value: student.value.lastName + ' ' + student.value.firstName },
      { key: 'Ngày sinh', value: student.value.dateOfBirth },
      { key: 'Giới tính', value: 'Nam' },
      { key: 'Địa chỉ', value: student.value.address }
    ]

    contactInfo.value = [
      { key: 'Email', value: student.value.email },
      {
        key: 'Số điện thoại',
        value: student.value.phoneNumber,
        hasAction: true,
        actionName: 'Chỉnh sửa',
        action: () => alert('Ai cho sửa')
      }
    ]
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="student flow container">
    <h1 class="fs-2">Thông tin {{ translate(student.role) }}</h1>
    <div class="student-info flow fs-6">
      <InfoGroup
        title="Thông tin cơ bản"
        :items="basicInfo"
      />
      <!-- Contact info -->
      <InfoGroup
        title="Thông tin liên hệ"
        :items="contactInfo"
      />
    </div>
  </div>
</template>

<style lang="scss">
.student-info {
  & > * {
    --flow-spacer: 2em;
  }
}
</style>
