<script setup>
import { storeToRefs } from 'pinia'
import NavigationItem from './NavigationItem.vue'
import { useMenuStore } from '@/stores/MenuStore'

defineProps({
  title: {
    type: String
  },
  haveSeparator: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  }
})

const { isExpanded } = storeToRefs(useMenuStore())
</script>

<template>
  <md-list class="nav">
    <md-item v-if="title">
      <div slot="headline">{{ isExpanded ? title : '' }}</div>
    </md-item>
    <NavigationItem
      v-for="(item, index) in items"
      :key="index"
      :name="item.name"
      :icon="item.icon"
      :urlName="item.urlName"
    />
    <slot></slot>
    <md-divider
      v-if="haveSeparator"
      role="separator"
    />
  </md-list>
</template>
