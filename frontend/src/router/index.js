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
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/TheProfile.vue'),
      children: [
        {
          path: 'classes',
          name: 'teacher.classes',
          component: () => import('@/views/teacher/TeacherClasses.vue')
        }
      ]
    }
  ],
  linkActiveClass: 'active'
})

router.beforeEach(async (to) => {
  const user = localStorage.getItem('user')

  if (to.name !== 'login.email' && to.name !== 'login.password' && !user) {
    return { name: 'login.email' }
  }
})

export default router
