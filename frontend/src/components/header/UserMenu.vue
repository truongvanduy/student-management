<script setup>
import { ref } from 'vue'
import IconMenu from '../menu/IconMenu.vue'
import MenuItem from '@/components/menu/MenuItem.vue'
import { useRouter } from 'vue-router'
import userService from '@/services/user.service'
import { useSnackbar } from '@/stores/SnackbarStore'
import getErrorMessage from '@/utils/getErrorMessage.util'

const router = useRouter()

async function handleSignOut() {
  try {
    await userService.logout()
    const { email } = JSON.parse(localStorage.getItem('user'))
    localStorage.removeItem('user')

    router.replace({ name: 'login.email', query: { email } })
    router.go(0)
  } catch (error) {
    const snackbar = useSnackbar()
    snackbar.show({
      type: 'error',
      message: getErrorMessage(error)
    })
  }
}

const menuItems = ref([
  {
    name: 'Thông tin cá nhân',
    icon: 'person',
    url: '#',
    onClick: () => {
      router.replace({ name: 'profile' })
    }
  },
  {
    name: 'Đăng xuất',
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
