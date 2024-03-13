<script setup>
import TheNavigation from './components/navigation/TheNavigation.vue'
import TheHeader from './components/header/TheHeader.vue'
import { useThemeStore } from './stores/ThemeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
</script>

<template>
  <div
    class="wrapper"
    :class="theme"
  >
    <TheHeader />
    <main class="main">
      <TheNavigation />
      <!-- <TheContent /> -->
      <div class="pane">
        <div class="scroll-wrapper">
          <div class="content">
            <router-view />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
md-list div[slot='headline'] {
  font-weight: 900;
}
</style>
