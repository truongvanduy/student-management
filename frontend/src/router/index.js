import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile',
      component: () => import('../views/TheProfile.vue')
    },
    {
      path: '/scores',
      name: 'scores',
      component: () => import('../views/ScoreView.vue')
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
    },
    {
      path: '/auth',
      name: 'authentication',
      component: () => import('@/views/AuthenticationView.vue'),
      meta: {
        layout: 'EmptyLayout'
      },
      children: [
        {
          path: 'login',
          name: 'login.email',
          component: () => import('@/views/authentication_views/SignInEmail.vue')
        },
        {
          path: 'login/:email',
          name: 'login.password',
          component: () => import('@/views/authentication_views/SignInPassword.vue'),
          props: (route) => ({ email: route.params.email })
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})

router.beforeEach(async (to) => {
  const student = localStorage.getItem('student')

  if (to.name !== 'login.email' && to.name !== 'login.password' && !student) {
    return { name: 'login.email' }
  }
})

export default router
