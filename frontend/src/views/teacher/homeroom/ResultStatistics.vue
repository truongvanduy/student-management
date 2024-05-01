<script setup>
import { computed, onBeforeMount, ref } from 'vue'
import { useSnackbar } from '@/stores/SnackbarStore'
import homeroomService from '@/services/homeroom.service'
import TheChart from '@/components/charts/TheChart.vue'
import { useRoute } from 'vue-router'
import getErrorMessage from '@/utils/getErrorMessage.util'

const route = useRoute()
const loading = ref(true)
const results = ref(null)
const snackbar = useSnackbar()

onBeforeMount(async () => {
  const { yearId } = route.query
  try {
    loading.value = true

    results.value = await homeroomService.getResultStatistics({
      yearId
    })
  } catch (error) {
    console.error(error)
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
  loading.value = false
})

const titles = ref(['Học kì I', 'Học kì II', 'Cả năm'])
const chartDatas = computed(() => {
  return results.value?.map((result) => {
    // Group student count by title
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

    // Convert to chart data format:
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
</script>

<template>
  <md-linear-progress
    v-if="loading && !results"
    indeterminate
    class="loading"
  ></md-linear-progress>
  <div
    v-else
    class="container flow"
    style="--container-width: 80rem"
  >
    <div>
      <div class="chart-list mt-10">
        <TheChart
          v-for="(chartData, index) in chartDatas"
          :key="index"
          :data="chartData"
          :title="titles[index]"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-list {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}
// .loading {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
// }
</style>
