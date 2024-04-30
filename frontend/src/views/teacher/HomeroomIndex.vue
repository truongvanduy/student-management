<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import yearService from '@/services/year.service'
import classService from '@/services/class.service'
import homeroomService from '@/services/homeroom.service'
import TheChart from './TheChart.vue'

// Init state
const loading = ref(true)
const response = ref(null)
const homeroomClass = ref(null)
const filteredClass = ref()
// const firstSemesterResults = computed(() => response.value?.firstSemesterResults)
const results = computed(() => response.value?.results)
const titles = ref(['Học kì I', 'Học kì II', 'Cả năm'])
const chartDatas = computed(() => {
  return results.value?.map((result) => {
    const titleCount = {
      'Học sinh Giỏi': 0,
      'Học sinh Khá': 0,
      'Học sinh Trung Bình': 0,
      'Học sinh Yếu': 0
    }

    result.forEach((el) => {
      if (titleCount[el.title.title]) {
        titleCount[el.title.title]++
      } else {
        titleCount[el.title.title] = 1
      }
    })
    console.log(titleCount)
    const labels = []
    const data = []
    Object.entries(titleCount).forEach(([title, count]) => {
      labels.push(title)
      data.push(count)
    })
    return {
      labels,
      datasets: [
        {
          label: 'Số lượng học sinh',
          data,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(255, 99, 132)',
            'rgb(153, 102, 255)'
          ]
        }
      ]
    }
  })
})
const years = ref([])
const snackbar = useSnackbar()
const selectedYear = defineModel('selectedYear')

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
      class: `${homeroomClass.value?.Grade?.gradeLevel}.${homeroomClass.value?.classOrder}`,
      studentCount: homeroomClass.value?.class?.studentCount
    }
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

    homeroomClass.value = await classService.getAll({
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

// Trigger reload content on successful deletetion
const reload = ref(false)

watch([reload, selectedYear], async () => {
  await updateStudentList()
  reload.value = false
})
</script>

<template>
  <md-linear-progress
    v-if="loading && !response"
    indeterminate
  ></md-linear-progress>
  <div
    v-else
    class="container flow"
    style="--container-width: 80rem"
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

    <div v-if="filteredClass">
      <div class="facb">
        <h3 class="fs-4">Lớp {{ filteredClass.class }}</h3>
        <p class="fs-5">Sĩ số: {{ filteredClass.studentCount }}</p>
      </div>
      <div class="chart-list">
        <TheChart
          v-for="(chartData, index) in chartDatas"
          :key="index"
          :data="chartData"
          :title="titles[index]"
        />
      </div>
    </div>

    <md-linear-progress
      v-else
      indeterminate
    ></md-linear-progress>
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
