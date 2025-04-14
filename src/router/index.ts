import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/JspreadsheetTest.vue'),
    },
    {
      path: '/worksheets',
      name: 'worksheets',
      component: () => import('../views/Worksheets.vue'),
    },
    {
      path: '/hand',
      name: 'hand',
      component: () => import('../views/HandsontableTest.vue'),
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/GetData.vue'),
    },
  ],
})

export default router
