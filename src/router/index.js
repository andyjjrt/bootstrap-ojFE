import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Problem from '../views/Problem.vue'
import Problemlist from '../views/Problemlist.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/problem',
    name: 'ProblemList',
    component: Problemlist
  },
  {
    path: '/problem/:id',
    name: 'Problem',
    component: Problem
  },
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass:"active",
  base: process.env.BASE_URL,
  routes
})

export default router
