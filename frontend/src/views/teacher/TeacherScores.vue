<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import classService from '@/services/class.service'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'
import ContentHeader from '@/components/ContentHeader.vue'
import MdFloatingActionButton from '@/components/buttons/MdFloatingActionButton.vue'

const activeSemester = ref(1)
const route = useRoute()
const { query } = route

const snackbar = useSnackbar()

const loading = ref(true)
const results = ref({})
const students = computed(() => results.value?.students)
const groupScores = computed(() => results.value?.groupScores)
const avgScores = computed(() => results.value?.avgScores)
const overallAvgScores = computed(() => results.value?.overallAvgScores)
const modifiedScores = ref({})
const yearId = ref(null)
const courseId = ref(null)
const reload = ref(false)

onMounted(async () => {
  yearId.value = query.yearId
  courseId.value = query.courseId

  try {
    results.value = await classService.getScores({
      ...query,
      semesterId: activeSemester.value || 1
    })
  } catch (error) {
    const snackbar = useSnackbar()
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
  }
})

watch([reload, activeSemester], async () => {
  try {
    loading.value = true
    results.value = await classService.getScores({
      ...query,
      semesterId: activeSemester.value || 1
    })
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  } finally {
    loading.value = false
    reload.value = false
  }
})

function handleSemesterChange(e) {
  activeSemester.value = e.target.activeTabIndex + 1
}

function handleModifyScore(e, score, index) {
  modifiedScores.value[index] = {
    id: score.id || null,
    content: {
      yearId: parseInt(yearId.value),
      semesterId: activeSemester.value,
      courseId: parseInt(courseId.value),
      score: e.target.innerText,
      type: score.type,
      studentId: score.studentId
    }
  }
}

function validateScore(score) {
  if (score === '') return true
  if (typeof score !== 'number' && isNaN(parseFloat(score))) {
    return false
  }
  score = parseFloat(score)
  return score >= 0.0 && score <= 10.0
}

async function handleSubmit() {
  const modifiedScoresArray = Object.values(modifiedScores.value)

  const invalidScores = modifiedScoresArray.filter((score) => !validateScore(score.content.score))
  if (invalidScores.length > 0) {
    snackbar.show({
      type: 'error',
      message: 'Điểm số không hợp lệ'
    })
    return
  }

  try {
    await classService.updateScores({
      scores: modifiedScoresArray
    })
    snackbar.show({
      type: 'success',
      message: 'Cập nhật điểm thành công'
    })
    reload.value = true
    modifiedScores.value = {}
  } catch (error) {
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
}
</script>

<template>
  <ContentHeader>Cập nhật điểm số</ContentHeader>
  <!-- Submit button -->
  <div
    class="container score-view"
    style="--content-max-width: 80rem"
  >
    <!-- Semester tabs -->
    <md-tabs
      aria-label="Content to view"
      @change="handleSemesterChange"
    >
      <md-secondary-tab
        id="semester-1-tab"
        aria-controls="semester-1-panel"
        active
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
    <table
      v-if="results"
      class="table mt-10 mx-auto"
    >
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ và tên đệm</th>
          <th>Tên</th>
          <th colspan="5">Kiểm tra thường xuyên</th>
          <th>GK</th>
          <th>CK</th>
          <th>ĐTB</th>
          <th v-if="activeSemester === 2">CN</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(score, index) in groupScores"
          :key="score.studentId"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ students[index].lastName }}</td>
          <td>{{ students[index].firstName }}</td>
          <!-- Regular score -->
          <td
            contenteditable="true"
            v-for="(scoreEl, regularIndex) in score.regular"
            :key="scoreEl.id"
            @input="(e) => handleModifyScore(e, scoreEl, index * 10 + regularIndex)"
          >
            {{ scoreEl?.score }}
          </td>
          <!-- Empty regular score -->
          <td
            @input="
              (e) =>
                handleModifyScore(
                  e,
                  {
                    type: 'regular',
                    studentId: students[index].id
                  },
                  index * 10 + score.regular.length + i
                )
            "
            contenteditable="true"
            v-for="i in 5 - score.regular.length"
            :key="i"
          ></td>
          <!-- Midterm score -->
          <td
            v-if="score.midterm"
            contenteditable="true"
            @input="(e) => handleModifyScore(e, score.midterm, index * 10 + 6)"
          >
            {{ score.midterm.score }}
          </td>
          <td
            v-else
            contenteditable="true"
            @input="
              (e) =>
                handleModifyScore(
                  e,
                  {
                    type: 'midterm',
                    studentId: students[index].id
                  },
                  index * 10 + 6
                )
            "
          ></td>
          <!-- Final score -->
          <td
            v-if="score.final"
            @input="(e) => handleModifyScore(e, score.final, index * 10 + 7)"
            contenteditable="true"
          >
            {{ score?.final?.score }}
          </td>
          <td
            v-else
            contenteditable="true"
            @input="
              (e) =>
                handleModifyScore(
                  e,
                  {
                    type: 'final',
                    studentId: students[index].id
                  },
                  index * 10 + 7
                )
            "
          ></td>
          <!-- Avg score -->
          <td>{{ avgScores[index] }}</td>
          <!-- Avg score -->
          <td v-if="activeSemester === 2">{{ overallAvgScores[index] }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Submit button -->
  <MdFloatingActionButton
    icon="check"
    label="Lưu thay đổi"
    variant="primary"
    @click="handleSubmit"
  ></MdFloatingActionButton>
</template>

<style lang="scss" src="@/assets/scss/components/_table.scss"></style>
<style lang="scss" scoped>
.score-view {
  display: flex;
  flex-direction: column;
}
</style>
