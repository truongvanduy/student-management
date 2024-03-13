<script setup>
import { useThemeStore } from '@/stores/ThemeStore'
import { storeToRefs } from 'pinia'
import MdIconButton from '../buttons/MdIconButton.vue'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
</script>
<template>
  <MdIconButton
    :style="'filled'"
    @click="themeStore.toggleTheme"
    >{{ theme === 'light' ? 'dark' : 'light' }}_mode</MdIconButton
  >
</template>
