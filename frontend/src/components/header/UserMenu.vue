<script setup>
import { ref } from 'vue'
import IconMenu from '../menu/IconMenu.vue'
import MenuItem from '@/components/menu/MenuItem.vue'
import studentService from '@/services/student.service'
import { useRouter } from 'vue-router'

const router = useRouter()

async function handleSignOut() {
  await studentService.logout()
  const { email } = JSON.parse(localStorage.getItem('user'))
  localStorage.removeItem('user')

  router.replace({ name: 'login.email', query: { email } })
  router.go(0)
}

const menuItems = ref([
  {
    name: 'Profile',
    icon: 'person',
    url: '#',
    onClick: () => {}
  },
  {
    name: 'Sign Out',
    icon: 'logout',
    url: '#',
    onClick: handleSignOut
  }
])
</script>
<template>
  <IconMenu
    icon="account_circle"
    anchor-id="user-menu"
  >
    <MenuItem
      v-for="(item, index) in menuItems"
      :key="index"
      :name="item.name"
      :icon="item.icon || undefined"
      :url="item.url"
      :icon-style="item.iconStyle || 'outlined'"
      @click="item.onClick"
    ></MenuItem>
  </IconMenu>
</template>
