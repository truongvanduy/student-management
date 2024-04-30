<script setup>
import studentService from '@/services/student.service'
import courseService from '@/services/course.service'
import yearService from '@/services/year.service'
import { computed, onMounted, ref, watchEffect } from 'vue'
import ScoreResult from '../components/score_view/ScoreResult.vue'

const years = ref([])
const activeYear = ref()

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
const errorMessage = ref('')
const semester = ref(1)
const loading = ref(true)

const filter = computed(() => {
  const filter = {
    yearId: activeYear.value
  }
  if (semester.value === 1) {
    filter.semesterId = 1
  }
  return filter
})

watchEffect(async () => {
  try {
    loading.value = true
    response.value = await studentService.getScores(filter.value)
    courses.value = await courseService.getAll()

    errorMessage.value = ''
    loading.value = false
  } catch (error) {
    console.error(error)

    loading.value = false
  }
  loading.value = false
})
</script>

<template>
  <h1 class="container fs-2">Điểm số</h1>
  <div
    class="container score-view"
    style="--content-max-width: 90rem"
  >
    <div
      style="display: flex"
      class="mb-4"
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
        @click="semester = 1"
        >Học kì 1</md-secondary-tab
      >
      <md-secondary-tab
        id="semester-2-tab"
        aria-controls="semester-2-panel"
        @click="semester = 2"
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
      v-if="!loading && response?.groupScores?.length > 0"
      :scores="response"
      :loading="loading"
      :courses="courses"
      :first-semester-results="response?.firstSemesterTitle"
      :second-semester-results="response?.secondSemesterTitle"
      :overall-results="response?.overallTitle"
      v-model:semester="semester"
      v-model:errorMessage="errorMessage"
    />
  </div>
</template>

<style lang="scss" src="../assets/scss/components/_table.scss"></style>
