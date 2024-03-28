<script setup>
import { ref, shallowRef, watch } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = shallowRef()

const isLoading = ref(false)

watch(
  () => route?.meta?.layout,
  async (metaLayout) => {
    isLoading.value = true
    try {
      const component = metaLayout && (await import(`@/layouts/${metaLayout}.vue`))

      layout.value = component?.default || DefaultLayout
    } catch (error) {
      layout.value = DefaultLayout
    }

    isLoading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <component
    v-else
    :is="layout"
  >
    <router-view />
  </component>
</template>

<style lang="scss" scoped></style>
