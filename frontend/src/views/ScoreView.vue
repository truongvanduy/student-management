<script setup>
import studentService from '@/services/student.service'
import courseService from '@/services/course.service'
import yearService from '@/services/year.service'
import { computed, onMounted, ref, watchEffect } from 'vue'
import ScoreResult from '../components/score_view/ScoreResult.vue'

const years = ref([])
const activeYear = ref(1)

onMounted(async () => {
  try {
    years.value = await yearService.getStudentYear()
    // Initialize active year to be the last year
    activeYear.value = years.value[years.value.length - 1].id
  } catch (error) {
    console.error(error)
  }
})

const courses = ref([])
const response = ref([])
const groupScores = ref([])
const firstSemesterAvg = ref([])
const secondSemesterAvg = ref([])
const wholeYearAvg = ref([])
const errorMessage = ref('')
const activeTab = ref(null)
const loading = ref(true)

const filter = computed(() => {
  const filter = {
    yearId: activeYear.value
  }
  if (activeTab.value === 1) {
    filter.semesterId = 1
  }
  return filter
})

watchEffect(async () => {
  try {
    loading.value = true
    response.value = await studentService.getScores(filter.value)
    courses.value = await courseService.getAll()

    groupScores.value = response.value.groupScores
    firstSemesterAvg.value = response.value.firstSemesterAvg
    secondSemesterAvg.value = response.value?.secondSemesterAvg
    wholeYearAvg.value = response.value?.wholeYearAvg

    errorMessage.value = ''
    loading.value = false
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response.data.message

    groupScores.value = []
    firstSemesterAvg.value = []
    secondSemesterAvg.value = []
    wholeYearAvg.value = []

    loading.value = false
  }
  loading.value = false
})
</script>

<template>
  <div class="container">
    <h1 class="fs-2">Điểm số</h1>
    <div
      style="display: flex"
      class="my-4"
    >
      <!-- Year Selection -->
      <md-outlined-select
        v-if="years.length > 0"
        class="ml-auto"
        label="Năm học"
      >
        <md-select-option
          v-for="(year, index) in years"
          :key="year.id"
          :value="year.id"
          :selected="index === years.length - 1 ? 'selected' : undefined"
          @click="activeYear = year.id"
        >
          <div slot="headline">{{ year.year }}</div>
        </md-select-option>
      </md-outlined-select>
    </div>

    <!-- Semester tabs -->
    <md-tabs aria-label="Content to view">
      <md-secondary-tab
        id="semester-1-tab"
        aria-controls="semester-1-panel"
        active
        @click="activeTab = 1"
        >Học kì 1</md-secondary-tab
      >
      <md-secondary-tab
        id="semester-2-tab"
        aria-controls="semester-2-panel"
        @click="activeTab = 2"
        >Học kì 2 & Cả năm</md-secondary-tab
      >
    </md-tabs>

    <!-- Loading progress indicator -->
    <md-linear-progress
      v-show="loading"
      indeterminate
    />

    <!-- Score table -->
    <ScoreResult
      :groupScores="groupScores"
      :loading="loading"
      :courses="courses"
      :firstSemesterAvg="firstSemesterAvg"
      :secondSemesterAvg="secondSemesterAvg"
      :wholeYearAvg="wholeYearAvg"
      v-model:activeTab="activeTab"
      v-model:errorMessage="errorMessage"
    />
  </div>
</template>

<style lang="scss" src="../assets/scss/components/_table.scss">
.score-table {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
</style>
