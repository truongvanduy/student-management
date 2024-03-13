<script setup>
defineProps({
  style: {
    type: String,
    default: 'outlined'
  }
})
</script>

<template>
  <md-icon
    class="material-symbols-rounded"
    :data-style="style"
  >
    <slot></slot>
  </md-icon>
</template>

<style lang="scss">
[data-style='outlined'] {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
[data-style='filled'] {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
