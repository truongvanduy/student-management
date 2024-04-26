<script setup>
import { storeToRefs } from 'pinia'
import NavigationList from './NavigationList.vue'

import { onBeforeMount, ref } from 'vue'
import { useMenuStore } from '@/stores/MenuStore'

const routes = {
  shared: [
    {
      name: 'Thông tin cá nhân',
      icon: 'person',
      urlName: 'profile'
    }
  ],
  student: [
    {
      name: 'Điểm số',
      icon: 'bar_chart',
      urlName: 'scores'
    }
  ],
  teacher: [
    {
      name: 'Lớp bộ môn',
      icon: 'bar_chart',
      urlName: 'teacher.classes'
    }
  ],
  admin: []
}

const authorizedRoutes = ref([...routes.shared])

onBeforeMount(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.role) {
    authorizedRoutes.value = [...authorizedRoutes.value, ...routes[user.role]]
  }
})

const menuStore = useMenuStore()

const { isOpened, isExpanded } = storeToRefs(menuStore)
</script>

<template>
  <nav-drawer
    :data-expanded="isExpanded"
    :class="isOpened ? 'open' : undefined"
  >
    <nav>
      <NavigationList
        :haveSeparator="false"
        :items="authorizedRoutes"
      >
      </NavigationList>
    </nav>
  </nav-drawer>
  <div
    class="overlay"
    @click="menuStore.toggleMenu"
  ></div>
</template>
