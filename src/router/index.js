import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sobre-nosotros',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/denuncias',
    name: 'Denuncias',
    component: () => import(/* webpackChunkName: "denuncias" */ '../views/Complaints.vue')
  },
  {
    path: '/zonas-inundables',
    name: 'Zonas',
    component: () => import(/* webpackChunkName: "zonas" */ '../views/FloodZones.vue')
  },
  {
    path: '/recorridos-evacuacion',
    name: 'Recorridos',
    component: () => import(/* webpackChunkName: "zonas" */ '../views/EvacuationWay.vue')
  },
  {
    path: '/gestion',
    name: 'Gestion',
    component: () => import(/* webpackChunkName: "gestion" */ '../views/Help.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
