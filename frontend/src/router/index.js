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
    // Teacher routes
    {
      path: '/teacher',
      name: 'teacher',
      children: [
        {
          path: 'classes',
          name: 'teacher.classes',
          component: () => import('@/views/teacher/TeacherClasses.vue')
        },
        {
          path: 'classes/scores',
          name: 'teacher.classes.scores',
          component: () => import('@/views/teacher/TeacherScores.vue')
        },
        {
          path: 'homeroom',
          name: 'teacher.homeroom',
          component: () => import('@/views/teacher/homeroom/HomeroomIndex.vue'),
          children: [
            {
              path: 'statistics',
              name: 'teacher.homeroom.statistics',
              component: () => import('@/views/teacher/homeroom/ResultStatistics.vue')
            },
            {
              path: 'students',
              name: 'teacher.homeroom.students',
              component: () => import('@/views/teacher/homeroom/HomeroomStudents.vue')
            },
            {
              path: 'conduct',
              name: 'teacher.homeroom.conduct',
              component: () => import('@/views/teacher/homeroom/ConductAssessment.vue')
            }
          ]
        },
        {
          path: 'homeroom/students/:id/scores',
          name: 'teacher.homeroom.scores',
          component: () => import('@/views/teacher/homeroom/StudentScore.vue'),
          props: true
        }
      ]
    },
    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      children: [
        {
          path: 'teachers',
          name: 'admin.teachers',
          component: () => import('@/views/admin/TeachersManagement.vue')
        },
        {
          path: 'teachers/create',
          name: 'admin.teachers.create',
          component: () => import('@/views/admin/TeacherForm.vue')
        },
        {
          path: 'students',
          name: 'admin.students',
          component: () => import('@/views/admin/StudentsManagement.vue')
        },
        {
          path: 'students/create',
          name: 'admin.students.create',
          component: () => import('@/views/admin/StudentForm.vue')
        },
        {
          path: 'students/edit/:id',
          name: 'admin.students.edit',
          component: () => import('@/views/admin/StudentForm.vue'),
          props: true
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
