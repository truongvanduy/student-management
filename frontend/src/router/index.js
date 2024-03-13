import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/users-management',
      name: 'users-management',
      component: () => import('../views/UsersManagementView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'FallBack',
      component: () => import('../views/DashboardView.vue')
    }
  ],
  linkActiveClass: 'active'
})

export default router
