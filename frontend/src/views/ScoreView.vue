<script setup>
import studentService from '@/services/student.service'
import courseService from '@/services/course.service'
import { ref, watch } from 'vue'

const courses = ref([])
const scores = ref([])
const fisrtSemesterScores = ref([])
const secondSemesterScores = ref([])
const groupScores = ref([])
const firstSemesterAvg = ref([])
const secondSemesterAvg = ref([])
const yearAvg = ref([])
const loading = ref(true)

function groupScoreByCourse(semesterScore) {
  const groupScores = Array.from({ length: courses.value.length }, () => ({ regular: [] }))
  semesterScore.value.forEach((score) => {
    if (score.type === 'regular') {
      groupScores[score.courseId - 1].regular.push(score)
    } else {
      groupScores[score.courseId - 1][score.type] = score
    }
  })
  return groupScores
}

function calcAvgScore(groupScores) {
  return groupScores.value.map((group) => {
    const sumOfRegularScore = group.regular.reduce((acc, cur) => acc + parseFloat(cur.score), 0)
    const numOfRegularScore = group.regular.length
    const midtermScore = group.midterm.score
    const finalScore = group.final.score

    const average = (
      (sumOfRegularScore + midtermScore * 2 + finalScore * 3) /
      (numOfRegularScore + 2 + 3)
    ).toFixed(1)

    firstSemesterAvg.value.push(average)

    return average
  })
}

const activeTab = ref(1)
watch(
  activeTab,
  async (semester) => {
    try {
      loading.value = true
      courses.value = await courseService.getAll()
      scores.value = await studentService.getScores(semester)
      if (semester === 1) {
        groupScores.value = groupScoreByCourse(scores)
        console.log(groupScores.value)
        firstSemesterAvg.value = calcAvgScore(groupScores)
      } else {
        fisrtSemesterScores.value = scores.value.filter((score) => score.semesterId === 1)
        secondSemesterScores.value = scores.value.filter((score) => score.semesterId === 2)

        groupScores.value = groupScoreByCourse(fisrtSemesterScores)
        firstSemesterAvg.value = calcAvgScore(groupScores)

        groupScores.value = groupScoreByCourse(secondSemesterScores)
        secondSemesterAvg.value = calcAvgScore(groupScores)

        yearAvg.value = firstSemesterAvg.value.map((score, index) => {
          const secondSemesterScore = secondSemesterAvg.value[index]
          return ((parseFloat(score) + parseFloat(secondSemesterScore) * 2) / 3).toFixed(1)
        })
      }

      // Group scores by course
    } catch (error) {
      console.error(error)
      loading.value = false
    }
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <div class="container">
    <h1 class="fs-2">Điểm số</h1>
    <div
      style="display: flex"
      class="my-5"
    >
      <md-outlined-select class="ml-auto">
        <md-select-option aria-label="blank"></md-select-option>
        <md-select-option
          selected
          value="apple"
        >
          <div slot="headline">2022 - 2023</div>
        </md-select-option>
        <md-select-option value="apricot">
          <div slot="headline">2023 - 2024</div>
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
      v-if="loading"
      indeterminate
    />

    <!-- Score table -->
    <div
      v-if="!loading"
      class="score-table mt-10"
      id="semester-1-panel"
      aria-labelledby="semester-1-tab"
      role="tabpanel"
    >
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Môn</th>
            <th v-if="activeTab == 2">HK1</th>
            <th colspan="5">Kiểm tra thường xuyên</th>
            <th>GK</th>
            <th>CK</th>
            <th>ĐTB</th>
            <th v-if="activeTab == 2">CN</th>
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
              v-if="activeTab == 2"
              class="text-end"
            >
              {{ firstSemesterAvg[course.id - 1] }}
            </td>
            <!-- KT thường xuyên - cột có điểm -->
            <td
              class="text-end"
              v-for="score in groupScores[course.id - 1].regular"
              :key="score.id"
            >
              {{ score.score }}
            </td>
            <!-- KT thường xuyên - cột trống -->
            <td
              class="text-end"
              v-for="i in 5 - groupScores[course.id - 1].regular.length"
              :key="i + groupScores[course.id - 1].regular.length"
            ></td>
            <!-- Giữa kì -->
            <td class="text-end">{{ groupScores[course.id - 1].midterm.score }}</td>
            <!-- Cuối kì -->
            <td class="text-end">{{ groupScores[course.id - 1].final.score }}</td>
            <!-- Điểm trung bình -->
            <td
              v-if="activeTab === 1"
              class="text-end"
            >
              {{ firstSemesterAvg[course.id - 1] }}
            </td>
            <td
              v-else
              class="text-end"
            >
              {{ secondSemesterAvg[course.id - 1] }}
            </td>
            <!-- Cả năm -->
            <td
              v-if="activeTab == 2"
              class="text-end"
            >
              {{ yearAvg[course.id - 1] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.score-table {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
</style>
