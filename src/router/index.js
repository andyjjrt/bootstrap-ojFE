import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue')
const Problem = () => import('../views/Problem.vue')
const Problemlist = () => import('../views/Problemlist.vue')
const Contest = () => import('../views/Contest.vue')
const ContestList = () => import('../views/ContestList.vue')
const Status = () => import(/* webpackChunkName: "status" */'../views/Status.vue')
const Submission = () => import(/* webpackChunkName: "status" */'../views/Submission.vue')
const Judger = () => import(/* webpackChunkName: "about" */'../views/Judger.vue')
const Faq = () => import(/* webpackChunkName: "about" */'../views/Faq.vue')
const OIRank = () => import(/* webpackChunkName: "rank" */'../views/OIRank.vue')
const ACMRank = () => import(/* webpackChunkName: "rank" */'../views/ACMRank.vue')
const Setting = () => import(/* webpackChunkName: "setting" */'../views/Setting.vue')
const Admin = () => import(/* webpackChunkName: "admin" */'../views/Admin.vue')
const User = () => import('../views/User.vue')
const ResetPassword = () => import('../views/ResetPassword.vue')
const NullPage = () => import('../views/404.vue')

const Contest_Home = () => import(/* webpackChunkName: "contest" */'../views/Contest/Home.vue')
const Contest_ProblemList = () => import(/* webpackChunkName: "contest" */'../views/Contest/ProblemList.vue')
const Contest_Problem = () => import(/* webpackChunkName: "contest" */'../views/Contest/Problem.vue')
const Contest_StatusList = () => import(/* webpackChunkName: "contest" */'../views/Contest/Status.vue')
const Contest_Rank = () => import(/* webpackChunkName: "contest" */'../views/Contest/Rank.vue')

const Setting_Profile = () => import(/* webpackChunkName: "setting" */'../views/Setting/Profile.vue')
const Setting_Account = () => import(/* webpackChunkName: "setting" */'../views/Setting/Account.vue')
const Setting_Security = () => import(/* webpackChunkName: "setting" */'../views/Setting/Security.vue')

const Admin_General = () => import(/* webpackChunkName: "admin" */'../views/Admin/General.vue')
const Admin_Users = () => import(/* webpackChunkName: "admin" */'../views/Admin/Users.vue')
const Admin_Announce = () => import(/* webpackChunkName: "admin" */'../views/Admin/Announce.vue')
const Admin_Config = () => import(/* webpackChunkName: "admin" */'../views/Admin/Config.vue')
const Admin_JudgeServer = () => import(/* webpackChunkName: "admin" */'../views/Admin/JudgeServer.vue')
const Admin_PruneTestcase = () => import(/* webpackChunkName: "admin" */'../views/Admin/PruneTestcase.vue')
const Admin_Problem = () => import(/* webpackChunkName: "admin" */'../views/Admin/Problem.vue')
const Admin_ContestList = () => import(/* webpackChunkName: "admin" */'../views/Admin/ContestList.vue')
const Admin_Contest = () => import(/* webpackChunkName: "admin" */'../views/Admin/Contest.vue')

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
    path: '/problem/:pid',
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
    path: '/faq',
    name: 'FAQ',
    component: Faq,
    meta:{
      title: 'FAQ'
    }
  },
  {
    path: '/acm-rank',
    name: 'ACM Rank',
    component: ACMRank,
    meta:{
      title: 'ACM Rank'
    }
  },
  {
    path: '/oi-rank',
    name: 'OI Rank',
    component: OIRank,
    meta:{
      title: 'OI Rank'
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
    path: '/admin',
    component: Admin,
    children:[
      {
        path: '',
        name: 'General',
        component: Admin_General,
        meta:{
          title: 'Admin',
          admin: 'DashBoard'
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: Admin_Users,
        meta:{
          title: 'Admin',
          admin: 'Users'
        }
      },
      {
        path: 'announce',
        name: 'Announce',
        component: Admin_Announce,
        meta:{
          title: 'Admin',
          admin: 'Announce'
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: Admin_Config,
        meta:{
          title: 'Admin',
          admin: 'Config'
        }
      },
      {
        path: 'judgeserver',
        name: 'Judge Server',
        component: Admin_JudgeServer,
        meta:{
          title: 'Admin',
          admin: 'Judge Server'
        }
      },
      {
        path: 'prunetestcase',
        name: 'Prune Testcase',
        component: Admin_PruneTestcase,
        meta:{
          title: 'Admin',
          admin: 'Prune Testcase'
        }
      },
      {
        path: 'problem',
        name: 'PublicProblem',
        component: Admin_Problem,
        meta:{
          title: 'Admin',
          admin: 'Problem'
        }
      },
      {
        path: 'contest',
        name: 'PublicContest',
        component: Admin_ContestList,
        meta:{
          title: 'Admin',
          admin: 'ContestList'
        }
      },
      {
        path: 'contest/:manage_contest_id',
        name: 'ManageContest',
        component: Admin_Contest,
        meta:{
          title: 'Admin',
          admin: 'Contest'
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
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    meta:{
      title: 'ResetPassword'
    }
  },
  {
    path: '*',
    name: '404',
    component: NullPage,
    meta:{
      title: 'Not Found'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  //linkExactActiveClass:"active",
  base: import.meta.env.BASE_URL,
  routes
})

export default router
