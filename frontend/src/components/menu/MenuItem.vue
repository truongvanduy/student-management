<script setup>
import MdIcon from '../icons/MdIcon.vue'

defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  iconStyle: {
    type: String,
    default: 'outlined'
  },
  url: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <md-menu-item>
    <div
      v-if="icon"
      slot="start"
    >
      <MdIcon :style="icon !== '' && iconStyle">
        {{ icon }}
      </MdIcon>
    </div>
    <div slot="headline">{{ name }}</div>
  </md-menu-item>
</template>

<style>
md-menu-item {
  min-width: max-content;
  max-width: 30ch;
}
</style>
