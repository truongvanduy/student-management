<script setup>
import { ref } from 'vue'
import IconMenu from '../menu/IconMenu.vue'

const menuItems = ref([
  {
    name: 'Profile',
    icon: 'person',
    url: '#'
  },
  {
    name: 'Sign Out',
    icon: 'logout',
    url: '#'
  }
])
</script>
<template>
  <IconMenu
    icon="account_circle"
    anchor-id="user-menu"
    :menuItems="menuItems"
  >
  </IconMenu>
</template>
