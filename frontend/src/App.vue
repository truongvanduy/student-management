<script setup>
import { ref, shallowRef, watch } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSnackbar } from './stores/SnackbarStore'
import TheSnackbar from './components/TheSnackbar.vue'

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

const { isOpened, type, message } = storeToRefs(useSnackbar())
</script>

<template>
  <div v-if="isLoading">
    <md-linear-progress indeterminate></md-linear-progress>
  </div>
  <component
    v-else
    :is="layout"
  >
    <router-view />
  </component>
  <TheSnackbar
    :is-opened="isOpened"
    :type="type"
    :content="message"
  />
</template>

<style lang="scss" scoped></style>
