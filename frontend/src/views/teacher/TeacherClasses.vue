<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import yearService from '@/services/year.service'
import { translate } from '@/utils/translator.util'
import classService from '@/services/class.service'
import getFullNameUtil from '@/utils/getFullName.util'
import { useRouter } from 'vue-router'

// Init state
const router = useRouter()
const loading = ref(true)
const classes = ref([])
const filteredClasses = computed(() => {
  return classes.value.map((classEl) => {
    const teacher = classEl?.class?.homeroom?.User
    return {
      course: classEl.course?.name || 'Chưa cập nhật',
      class: `${classEl?.class?.Grade?.gradeLevel}.${classEl?.classOrder}`,
      homeroomTeacher: getFullNameUtil(teacher),
      studentCount: classEl?.class?.studentCount,
      query: {
        order: classEl.classOrder,
        yearId: classEl.yearId,
        gradeId: classEl.gradeId
      }
    }
  })
})
const years = ref([])
const snackbar = useSnackbar()
const selectedYear = defineModel('selectedYear')

onMounted(async () => {
  try {
    loading.value = true

    years.value = await yearService.getAll()
    selectedYear.value = years.value[years.value.length - 1].id

    classes.value = await classService.getAll({
      yearId: selectedYear.value
    })
    console.log(classes.value)
  } catch (error) {
    console.error(error)
    snackbar.show({
      type: 'error',
      message: error.response.data.message || 'Có lỗi xảy ra'
    })
  }
  loading.value = false
})

// Hanlde search

async function updateStudentList() {
  try {
    loading.value = true

    classes.value = await classService.getAll({
      yearId: selectedYear.value
    })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
}

// Handle actions
function handleViewClick(query) {
  router.push({ name: 'teacher.classes.scores', query })
}

// Trigger reload content on successful deletetion
const reload = ref(false)

watch([reload, selectedYear], async () => {
  await updateStudentList()
  reload.value = false
})
</script>

<template>
  <md-linear-progress
    v-if="loading"
    indeterminate
  ></md-linear-progress>
  <div
    v-else
    class="container flow"
  >
    <h1 class="fs-2">Quản lý lớp học</h1>

    <div class="facb">
      <!-- Year Selection -->
      <md-outlined-select
        v-if="years && years.length > 0"
        class="ml-auto"
        label="Năm học"
        v-model="selectedYear"
      >
        <md-select-option
          v-for="year in years"
          :key="year.id"
          :value="year.id"
        >
          <div slot="headline">{{ year.year }}</div>
        </md-select-option>
      </md-outlined-select>
    </div>

    <!-- Result table -->
    <table
      v-if="filteredClasses.length > 0"
      class="table table-solid table-full pb-8 mb-20"
    >
      <thead>
        <tr>
          <th>Lớp</th>
          <th>Sĩ số</th>
          <th>Giáo viên chủ nhiệm</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(classEl, index) in filteredClasses"
          :key="index"
        >
          <td class="text-center">{{ classEl.class }}</td>
          <td class="text-center">{{ translate(classEl.studentCount) }}</td>
          <td class="text-center">{{ classEl.homeroomTeacher }}</td>
          <td>
            <div class="student-row">
              <md-assist-chip
                class="mx-auto"
                label="Xem"
                @click="() => handleViewClick(classEl.query)"
              ></md-assist-chip>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No result -->
    <div
      v-else
      class="fs5"
    >
      Không tìm thấy sách. Vui lòng thử lại với từ khóa khác.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-full {
  width: 100%;
}
.student {
  &-row {
    display: flex;
    gap: 0.5rem;
  }
  &-img {
    width: 3rem;
    height: 4rem;
    flex-shrink: 0;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
