<script setup>
import { ref } from 'vue'
import MdIconButton from '../buttons/MdIconButton.vue'

defineProps({
  icon: {
    type: String,
    required: true,
    default: 'menu'
  },
  anchorId: {
    type: String,
    required: true
  }
})

const menuEl = ref(null)

const toggleMenu = () => {
  menuEl.value.open = !menuEl.value.open
}
</script>

<template>
  <!-- Note the position: relative style -->
  <span style="position: relative">
    <MdIconButton
      :id="anchorId"
      @click="toggleMenu"
    >
      {{ icon }}
    </MdIconButton>

    <md-menu
      ref="menuEl"
      :anchor="anchorId"
    >
      <slot></slot>
    </md-menu>
  </span>
</template>
