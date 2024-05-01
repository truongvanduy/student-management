<script setup>
import courseService from '@/services/course.service'
import { computed, ref, watchEffect } from 'vue'
import ScoreResult from '@/components/score_view/ScoreResult.vue'
import ContentHeader from '@/components/ContentHeader.vue'
import homeroomService from '@/services/homeroom.service'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import { getFullName } from '@/utils/getFullName.util'

const { id } = defineProps(['id'])
const route = useRoute()
const { yearId } = route.query

const courses = ref([])
const response = ref([])
const errorMessage = ref('')
const semester = ref(1)
const loading = ref(true)
const snackbar = useSnackbar()

const filter = computed(() => {
  const filter = {
    yearId
  }
  if (semester.value === 1) {
    filter.semesterId = 1
  }
  return filter
})

function handleSemesterChange(e) {
  semester.value = e.target.activeTabIndex + 1
}

watchEffect(async () => {
  try {
    loading.value = true
    response.value = await homeroomService.getStudentScores(id, filter.value)
    console.log(response.value)
    courses.value = await courseService.getAll()
  } catch (error) {
    console.error(error)
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Main content -->
  <ContentHeader>Điểm số</ContentHeader>
  <div
    class="container score-view flow"
    style="--content-max-width: 90rem"
  >
    <div class="flex">
      <p
        v-if="response && response.student"
        class="fs-5 ml-auto"
      >
        Học sinh: <b> {{ getFullName(response?.student) }}</b>
      </p>
    </div>

    <!-- Semester tabs -->
    <md-tabs
      aria-label="Content to view"
      @change="handleSemesterChange"
    >
      <md-secondary-tab
        id="semester-1-tab"
        aria-controls="semester-1-panel"
        >Học kì 1</md-secondary-tab
      >
      <md-secondary-tab
        id="semester-2-tab"
        aria-controls="semester-2-panel"
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

<style lang="scss" src="@/assets/scss/components/_table.scss"></style>
