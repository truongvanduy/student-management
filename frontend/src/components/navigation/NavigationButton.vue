<script setup>
/**
 * This component is used to decide:
 * - Functionality: whether to show the expand or the menu toggle button based on the screen size (with a breakpoint of 1024px)
 * - Icon UI: whether to show the menu or the menu_open icon based on the menu state (expanded or not || opened or not)
 */

import { useMenuStore } from '@/stores/MenuStore'
import MdIcon from '../icons/MdIcon.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  type: {
    type: String,
    required: true
  }
})

const menuStore = useMenuStore()

// Window resize event listener

const windowHeight = ref(window.innerWidth)

// Categorized as large screen if the window width is greater than 1024px
const isExpansibleView = computed(() => {
  return windowHeight.value > 1024
})

function onResize() {
  windowHeight.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
<template>
  <md-icon-button @click="menuStore[type]">
    <!-- On large screen (> 1024px) -->
    <MdIcon v-if="isExpansibleView">
      {{ menuStore.isExpanded ? 'menu_open' : 'menu' }}
    </MdIcon>
    <!-- On small screen (<= 1024px) -->
    <MdIcon v-else>
      {{ menuStore.isOpened ? 'menu_open' : 'menu' }}
    </MdIcon>
  </md-icon-button>
</template>

<style lang="scss" scoped></style>
