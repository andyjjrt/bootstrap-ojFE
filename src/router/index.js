import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue')
const Problem = () => import('../views/Problem.vue')
const Problemlist = () => import('../views/Problemlist.vue')
const Contest = () => import(/* webpackChunkName: "contest" */'../views/Contest.vue')
const ContestList = () => import(/* webpackChunkName: "contest" */'../views/ContestList.vue')
const Status = () => import('../views/Status.vue')
const Submission = () => import('../views/Submission.vue')
const Judger = () => import('../views/Judger.vue')
const Setting = () => import(/* webpackChunkName: "setting" */'../views/Setting.vue')
const User = () => import('../views/User.vue')

const Contest_Home = () => import(/* webpackChunkName: "contest" */'../views/Contest/Home.vue')
const Contest_ProblemList = () => import(/* webpackChunkName: "contest" */'../views/Contest/ProblemList.vue')
const Contest_Problem = () => import(/* webpackChunkName: "contest" */'../views/Contest/Problem.vue')
const Contest_StatusList = () => import(/* webpackChunkName: "contest" */'../views/Contest/Status.vue')
const Contest_Rank = () => import(/* webpackChunkName: "contest" */'../views/Contest/Rank.vue')

const Setting_Profile = () => import(/* webpackChunkName: "setting" */'../views/Setting/Profile.vue')
const Setting_Account = () => import(/* webpackChunkName: "setting" */'../views/Setting/Account.vue')
const Setting_Security = () => import(/* webpackChunkName: "setting" */'../views/Setting/Security.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title: 'Home'
    }
  },
  {
    path: '/problem',
    name: 'ProblemList',
    component: Problemlist,
    meta:{
      title: 'Problem'
    }
  },
  {
    path: '/problem/:id',
    name: 'Problem',
    component: Problem,
    meta:{
      title: 'Problem'
    }
  },
  {
    path: '/contest',
    name: 'ContestList',
    component: ContestList,
    meta:{
      title: 'Contest'
    }
  },
  {
    path: '/contest/:id',
    component: Contest,
    children:[
      {
        path: '',
        name: 'Contest',
        component: Contest_Home,
        meta:{
          title: 'Contest',
          contest: 'Overview'
        }
      },
      {
        path: 'problem',
        name: 'Contest_ProblemList',
        component: Contest_ProblemList,
        meta:{
          title: 'Contest',
          contest: 'Problem'
        }
      },
      {
        path: 'problem/:pid',
        name: 'Contest_Problem',
        component: Contest_Problem,
        meta:{
          title: 'Contest',
          contest: 'Problem'
        }
      },
      {
        path: 'status',
        name: 'Contest_StatusList',
        component: Contest_StatusList,
        meta:{
          title: 'Contest',
          contest: 'Status'
        }
      },
      {
        path: 'rank',
        name: 'Contest_Rank',
        component: Contest_Rank,
        meta:{
          title: 'Contest',
          contest: 'Rank'
        }
      },
    ],
  },
  {
    path: '/status',
    name: 'Status',
    component: Status,
    meta:{
      title: 'Status'
    }
  },
  {
    path: '/status/:submission_id',
    name: 'Submission',
    component: Submission,
    meta:{
      title: 'Status'
    }
  },
  {
    path: '/judger',
    name: 'Judger',
    component: Judger,
    meta:{
      title: 'Judger'
    }
  },
  {
    path: '/setting',
    component: Setting,
    children:[
      {
        path: '',
        name: 'Profile',
        component: Setting_Profile,
        meta:{
          title: 'Setting',
          setting: 'Profile'
        }
      },
      {
        path: 'account',
        name: 'Account',
        component: Setting_Account,
        meta:{
          title: 'Setting',
          setting: 'Account'
        }
      },
      {
        path: 'security',
        name: 'Security',
        component: Setting_Security,
        meta:{
          title: 'Setting',
          setting: 'Security'
        }
      },
    ],
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta:{
      title: 'User'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  //linkExactActiveClass:"active",
  base: process.env.BASE_URL,
  routes
})


export default router
