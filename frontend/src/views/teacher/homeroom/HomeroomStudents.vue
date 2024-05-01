<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import homeroomService from '@/services/homeroom.service'
import { translate } from '@/utils/translator.util'
import { toDMY } from '@/utils/date.util'

const route = useRoute()
const { query } = route
const snackbar = useSnackbar()
const loading = ref(true)
const students = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    loading.value = true

    const { yearId, classId } = query
    students.value = await homeroomService.getStudents({
      yearId,
      classId
    })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
})

function handleViewScoreClick(id) {
  router.push({
    name: 'teacher.homeroom.scores',
    params: { id },
    query: {
      yearId: query.yearId
    }
  })
}
</script>

<template>
  <div
    class="container score-view"
    style="--content-max-width: 80rem"
  >
    <!-- Loading progress indicator -->
    <md-linear-progress
      v-show="loading"
      indeterminate
    />

    <!-- Score table -->
    <table class="table table-solid mt-10 mx-auto">
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ và tên đệm</th>
          <th>Tên</th>
          <th>Giới tính</th>
          <th>Ngày sinh</th>
          <th>SĐT</th>
          <th>Địa chỉ email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in students"
          :key="student.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ translate(student.sex) }}</td>
          <td>{{ toDMY(student.dateOfBirth) }}</td>
          <td>{{ student.phoneNumber }}</td>
          <td>{{ student.email }}</td>
          <td>
            <div class="table-actions">
              <md-text-button @click="handleViewScoreClick(student.id)">Xem điểm</md-text-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" src="@/assets/scss/components/_table.scss"></style>
<style lang="scss" scoped>
.score-view {
  display: flex;
  flex-direction: column;
}
</style>
