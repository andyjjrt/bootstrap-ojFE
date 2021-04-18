import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Problem from '../views/Problem.vue'
import Problemlist from '../views/Problemlist.vue'
import Contest from '../views/Contest.vue'
import ContestList from '../views/ContestList.vue'
import Status from '../views/Status.vue'
import User from '../views/User.vue'

import Contest_Home from '../views/Contest/Home.vue'
import Contest_ProblemList from '../views/Contest/ProblemList.vue'
import Contest_Problem from '../views/Contest/Problem.vue'
import Contest_StatusList from '../views/Contest/Status.vue'

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
  {
    path: '/contest',
    name: 'ContestList',
    component: ContestList
  },
  {
    path: '/contest/:id',
    component: Contest,
    children:[
      {
        path: '',
        name: 'Contest',
        component: Contest_Home
      },
      {
        path: 'problem',
        name: 'Contest_ProblemList',
        component: Contest_ProblemList
      },
      {
        path: 'problem/:pid',
        name: 'Contest_Problem',
        component: Contest_Problem
      },
      {
        path: 'status',
        name: 'Contest_StatusList',
        component: Contest_StatusList
      },
    ],
  },
  {
    path: '/status',
    name: 'Status',
    component: Status
  },
  {
    path: '/user',
    name: 'User',
    component: User
  }
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass:"active",
  base: process.env.BASE_URL,
  routes
})

export default router
