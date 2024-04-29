<script setup>
import { useMenuStore } from '@/stores/MenuStore'
import MdIcon from '../icons/MdIcon.vue'
import { storeToRefs } from 'pinia'

defineProps({
  name: {
    type: String,
    required: true,
    default: 'Menu Item'
  },
  icon: {
    type: String,
    default: ''
  },
  urlName: {
    type: String,
    default: '#'
  }
})

const menuStore = useMenuStore()

const { isExpanded } = storeToRefs(menuStore)
</script>

<template>
  <router-link
    :to="{ name: urlName }"
    tabindex="-1"
    v-slot="{ isActive }"
  >
    <md-list-item
      @click="menuStore.toggleMenu"
      :data-expanded="isExpanded"
      :selected="isActive ? 'selected' : undefined"
      interactive
      type="button"
    >
      <MdIcon
        v-if="icon !== '' && isExpanded"
        slot="start"
        :style="isActive ? 'filled' : 'outlined'"
        >{{ icon }}</MdIcon
      >
      <template v-if="isExpanded"> {{ name }} </template>
      <MdIcon
        v-else
        slot="headline"
        :style="isActive ? 'filled' : 'outlined'"
        >{{ icon }}</MdIcon
      >
    </md-list-item>
  </router-link>
</template>
<style>
md-list-item {
  --md-outlined-icon-button-container-shape: 999px;
}
</style>
