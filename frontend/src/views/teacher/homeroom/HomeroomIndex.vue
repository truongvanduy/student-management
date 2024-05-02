<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import yearService from '@/services/year.service'
import homeroomService from '@/services/homeroom.service'
import { useRoute, useRouter } from 'vue-router'
import { getClassName } from '@/utils/class.util'

// Init state
const loading = ref(true)
const response = ref(null)
const homeroomClass = ref(null)
const filteredClass = ref()
const years = ref([])
const snackbar = useSnackbar()
const selectedYear = ref(null)

onBeforeMount(async () => {
  try {
    loading.value = true

    years.value = await yearService.getAll()
    selectedYear.value = years.value[years.value.length - 1].id

    response.value = await homeroomService.index({
      yearId: selectedYear.value
    })

    homeroomClass.value = response.value.homeroomClass
    filteredClass.value = {
      class: getClassName(homeroomClass.value?.class),
      studentCount: homeroomClass.value?.class?.studentCount
    }
  } catch (error) {
    console.error(error)
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
})

const router = useRouter()

const tabRoutes = computed(() => [
  { name: 'teacher.homeroom.students', query: { yearId: selectedYear.value } },
  { name: 'teacher.homeroom.statistics', query: { yearId: selectedYear.value } },
  { name: 'teacher.homeroom.conduct', query: { yearId: selectedYear.value } }
])
const selectedTabIndex = ref(0)
const handleTabChange = (e) => {
  selectedTabIndex.value = e.target.activeTabIndex
}

watch(
  [selectedTabIndex, selectedYear],
  () => {
    if (selectedYear.value === null) return

    router.push(tabRoutes.value[selectedTabIndex.value])
  },
  { immediate: true }
)
</script>

<template>
  <!-- Loading Progress Indicator -->
  <md-linear-progress
    v-if="loading && !response"
    indeterminate
  ></md-linear-progress>

  <!-- Main content -->
  <div
    v-else
    class="container flow homeroom-container"
    style="--container-width: 80rem"
  >
    <h1 class="fs-2">Quản lý lớp chủ nhiệm</h1>

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

    <div v-if="filteredClass">
      <div class="facb">
        <h3 class="fs-4">Lớp {{ filteredClass.class }}</h3>
        <p class="fs-5">Sĩ số: {{ filteredClass.studentCount }}</p>
      </div>

      <md-tabs @change="handleTabChange">
        <md-primary-tab>Danh sách lớp</md-primary-tab>
        <md-primary-tab>Kết quả học tập</md-primary-tab>
        <md-primary-tab>Đánh giá hạnh kiểm</md-primary-tab>
      </md-tabs>
      <router-view />
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

.chart-list {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
