<script setup>
import { useSnackbar } from '@/stores/SnackbarStore'
import MdIconButton from './buttons/MdIconButton.vue'
import MdIcon from './icons/MdIcon.vue'
import { ref } from 'vue'
defineProps({
  type: {
    type: String,
    default: 'error'
  },
  isOpened: {
    type: Boolean,
    default: true
  },
  content: {
    type: String,
    default: 'Content'
  },
  actions: {
    type: Array,
    default: () => []
  }
})

const status = ref({
  success: {
    class: 'success',
    icon: 'check'
  },
  error: {
    class: 'error',
    icon: 'error'
  }
})

const snackbar = useSnackbar()
</script>
<template>
  <div
    v-if="isOpened"
    class="snackbar"
  >
    <div
      class="snackbar-status"
      :class="status[type].class"
    >
      <MdIcon>{{ status[type].icon }}</MdIcon>
    </div>
    <div class="snackbar-body">
      <p class="snackbar-content">{{ content }}</p>
    </div>
    <div
      v-if="actions?.length > 0"
      class="snackbar-action"
    >
      <md-text-button class="snackbar-action-item">OK</md-text-button>
    </div>
    <div class="snackbar-close">
      <MdIconButton @click="snackbar.close">close</MdIconButton>
    </div>
  </div>
</template>

<style lang="scss">
.snackbar {
  position: fixed;
  bottom: calc(2 * var(--content-margin));
  left: calc(2 * var(--content-margin));
  z-index: 9999;

  padding: 0.75rem;
  padding-left: 1rem;
  // width: min(100%, 30rem);
  border-radius: var(--catalog-shape-xl);

  background-color: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);

  display: flex;
  align-items: center;
  gap: 0.75rem;

  &-status {
    display: flex;
    justify-content: center;
    align-items: center;
    &.success md-icon {
      color: var(--md-sys-color-inverse-primary);
    }
    &.error md-icon {
      color: var(--md-sys-color-error);
    }
  }

  & md-icon-button {
    --md-icon-button-icon-color: var(--md-sys-color-inverse-on-surface);
  }
  &-action {
    &-item {
      --md-text-button-label-text-color: var(--md-sys-color-inverse-primary);
    }
  }
}
</style>
