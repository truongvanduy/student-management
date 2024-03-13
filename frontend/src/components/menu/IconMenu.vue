<script setup>
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
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
  },
  menuItems: {
    type: Array,
    required: true,
    default: () => []
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
      <MenuItem
        v-for="(item, index) in menuItems"
        :key="index"
        :name="item.name"
        :icon="item.icon || undefined"
        :url="item.url"
        :icon-style="item.iconStyle || 'outlined'"
      ></MenuItem>
    </md-menu>
  </span>
</template>
