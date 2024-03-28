<script setup>
import MdIcon from '../icons/MdIcon.vue'
import { computed, onMounted, ref } from 'vue'
const props = defineProps([
  'scores',
  'loading',
  'courses',
  'groupScores',
  'firstSemesterResults',
  'secondSemesterResults',
  'overallResults'
])
const semester = defineModel('semester', { required: true })
const errorMessage = defineModel('errorMessage', { required: true })

const items = ref([])
const courseArray = computed(() => {
  const courseArray = Array.from({ length: props.courses.length + 1 }, () => '')
  props.courses.forEach((course) => {
    courseArray[course.id] = course.name
  })
  return courseArray
})

onMounted(() => {
  // Suggestion for condition 1
  if (props.firstSemesterResults.reasons.failAvgScore) {
    items.value.push(`Điểm trung bình >= ${props.firstSemesterResults.avg}`)
  }

  // Suggestion for condition 2
  const { failMainCourses, failCourses } = props.firstSemesterResults.reasons
  if (failMainCourses.length > 0) {
    let suggestion = 'Điểm trung bình các môn: '
    let courseNames = []
    failMainCourses.forEach((courseId) => {
      courseNames.push(courseArray.value[courseId])
    })

    suggestion += `${courseNames.join(', ')} >= ${props.firstSemesterResults.avg}`
    items.value.push(suggestion)
  }

  // Suggestion for condition 3
  if (failCourses.length > 0) {
    let suggestion = 'Điểm trung bình các môn: '
    failCourses.forEach((courseId) => {
      suggestion += `${courseArray.value[courseId]}, `
    })
    suggestion += ` >= ${props.firstSemesterResults.minAvg}`
    items.value.push(suggestion)
  }
})
</script>

<template>
  <div
    class="score-result mt-10"
    id="semester-1-panel"
    aria-labelledby="semester-1-tab"
    role="tabpanel"
  >
    <!-- Detail -->
    <table v-if="scores && scores?.groupScores?.length > 0 && !loading">
      <thead>
        <tr>
          <th>STT</th>
          <th>Môn</th>
          <th v-if="semester == 2">HK1</th>
          <th colspan="5">Kiểm tra thường xuyên</th>
          <th>GK</th>
          <th>CK</th>
          <th>ĐTB</th>
          <th v-if="semester == 2">CN</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="course in courses"
          :key="course.id"
        >
          <!-- STT -->
          <td>{{ course.id }}</td>
          <!-- Môn -->
          <td>{{ course.id == 12 ? 'GDQP & AN' : course.name }}</td>
          <!-- HK1 -->
          <td
            v-if="semester == 2"
            class="text-end"
          >
            {{ scores?.firstSemesterAvgs[course.id - 1] }}
          </td>
          <!-- KT thường xuyên - cột có điểm -->
          <td
            class="text-end"
            v-for="score in scores.groupScores[course.id - 1].regular"
            :key="score.id"
          >
            {{ score.score }}
          </td>
          <!-- KT thường xuyên - cột trống -->
          <td
            class="text-end"
            v-for="i in 5 - scores?.groupScores[course.id - 1]?.regular.length"
            :key="i + scores?.groupScores[course.id - 1]?.regular.length"
          ></td>
          <!-- Giữa kì -->
          <td class="text-end">{{ scores?.groupScores[course.id - 1].midterm.score }}</td>
          <!-- Cuối kì -->
          <td class="text-end">{{ scores?.groupScores[course.id - 1].final.score }}</td>
          <!-- Điểm trung bình -->
          <td
            v-if="semester === 1"
            class="text-end"
          >
            {{ scores?.firstSemesterAvgs[course.id - 1] }}
          </td>
          <td
            v-else
            class="text-end"
          >
            {{ scores?.secondSemesterAvgs[course.id - 1] }}
          </td>
          <!-- Cả năm -->
          <td
            v-if="semester == 2"
            class="text-end"
          >
            {{ scores?.overallAvgs[course.id - 1] }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="score-summary">
      <!-- Overall -->
      <table class="score-summary-table mx-auto">
        <thead>
          <tr>
            <th>Học kì</th>
            <th>Điểm trung bình</th>
            <th>Danh hiệu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">1</td>
            <td class="text-center">
              {{ scores?.firstSemesterAvg }}
            </td>
            <td class="text-center">{{ firstSemesterResults.title }}</td>
          </tr>
          <tr v-if="semester === 2">
            <td class="text-center">2</td>
            <td class="text-center">{{ scores?.secondSemesterAvg }}</td>
            <td class="text-center">{{ secondSemesterResults?.title }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Suggestion -->
      <div class="score-suggestion | info-group flow figure mt-8 mx-auto">
        <h3 class="fs-4 pl-4 mb-4 fw-500"></h3>
        <p class="fs-6 pl-4">
          Để đạt được danh hiệu {{ firstSemesterResults?.nextTitle }}, bạn cần:
        </p>
        <md-list v-if="items.length > 0">
          <template
            v-for="(item, index) in items"
            :key="index"
          >
            <md-divider></md-divider>
            <md-list-item type="text">
              <MdIcon
                slot="start"
                class=""
                >check</MdIcon
              >
              <p
                slot="headline"
                class="fs-6 info-value"
              >
                {{ item }}
              </p>
            </md-list-item>
          </template>
        </md-list>
      </div>
    </div>

    <!-- Error message -->
    <h3
      v-if="errorMessage && !loading"
      class="fs-3"
    >
      {{ errorMessage }}
    </h3>
  </div>
</template>
<style lang="scss" src="../../assets/scss/components/_info-group.scss"></style>
<style lang="scss">
.score {
  &-result {
    display: flex;
    align-items: start;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;

    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  &-summary {
    min-width: 30rem;
    flex: 1;
    &-table {
      justify-self: end;
    }
  }
  &-suggestion {
    max-width: 50rem;
  }
}
</style>
