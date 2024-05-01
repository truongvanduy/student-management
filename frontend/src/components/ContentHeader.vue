<script setup>
import MdIconButton from '@/components/buttons/MdIconButton.vue'
defineProps({
  haveContainer: {
    type: Boolean,
    default: true
  }
})
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="content-header">
    <MdIconButton @click="router.go(-1)">arrow_back</MdIconButton>
    <div
      v-if="haveContainer"
      class="container"
    >
      <h1 class="fs-3">
        <slot></slot>
      </h1>
    </div>
    <div v-else>
      <h1 class="fs-3 ml-15">
        <slot></slot>
      </h1>
    </div>
  </div>
</template>

<style lang="scss">
.content-header {
  position: relative;
  display: flex;
  align-items: center;
  column-gap: 2rem;
  container: container / inline-size;

  /**=============================
    65rem: 60rem (container width)
          + 3rem (back button size)
          + 2rem (column gap)
  ===============================*/
  @container container (width > 65rem) {
    md-icon-button {
      position: absolute;
    }
  }
}
</style>
