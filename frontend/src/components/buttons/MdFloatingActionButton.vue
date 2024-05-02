<script setup>
import MdIcon from '../icons/MdIcon.vue'
defineProps({
  label: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium'
  },
  isFixed: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: 'add'
  },
  variant: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <md-fab
    :class="{ fab: isFixed }"
    :size="size"
    :aria-label="label"
    :label="size === 'medium' ? label : ''"
    :variant="variant"
  >
    <MdIcon
      slot="icon"
      :font-size="size === 'large' ? 2.25 : 1.5"
      >{{ icon }}</MdIcon
    >
  </md-fab>
</template>

<style lang="scss" scoped>
.fab {
  position: fixed;
  z-index: 1;
  right: calc(2 * var(--content-margin));
  bottom: calc(2 * var(--content-margin));
}
</style>
