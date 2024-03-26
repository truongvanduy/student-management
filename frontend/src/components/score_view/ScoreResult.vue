<script setup>
defineProps([
  'groupScores',
  'loading',
  'courses',
  'firstSemesterAvg',
  'secondSemesterAvg',
  'wholeYearAvg'
])
const activeTab = defineModel('activeTab', { required: true })
const errorMessage = defineModel('errorMessage', { required: true })
</script>

<template>
  <div
    class="score-table mt-10"
    id="semester-1-panel"
    aria-labelledby="semester-1-tab"
    role="tabpanel"
  >
    <table v-if="groupScores.length > 0 && !loading">
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
            v-for="score in groupScores[course.id - 1]?.regular"
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
            {{ wholeYearAvg[course.id - 1] }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Error message -->
    <h3
      v-if="errorMessage && !loading"
      class="fs-3"
    >
      {{ errorMessage }}
    </h3>
  </div>
</template>
