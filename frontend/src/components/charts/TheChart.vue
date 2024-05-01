<script setup>
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
const { data, title } = defineProps(['data', 'title'])
const context = ref(null)

onMounted(async () => {
  // eslint-disable-next-line no-unused-vars
  const myChart = await new Chart(context.value, {
    type: 'doughnut',
    data: data
  })
})
</script>
<template>
  <div class="chart-container">
    <canvas
      ref="context"
      id="acquisitions"
    ></canvas>
    <h4 class="fs-5">{{ title || 'Biểu đồ' }}</h4>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: min(100%, 24rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
