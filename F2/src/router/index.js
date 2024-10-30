import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetail from '../components/MovieDetail.vue'
import ActorDetail from '../components/ActorDetail.vue'
//import Feedback from '../components/Feedback.vue'
import Feedbacks from '../components/Feedbacks.vue'

import Question from '../components/Question.vue'
import Polling from '../components/Poll.vue'
import PollDetail from '../components/PollDetail.vue'
import PollAnalysis from '../components/pollAnalysis.vue'
import Table from '../components/table.vue'
//import Auth from '../components/auth.vue'
import Login from '../components/Login.vue'
import Participants from '../components/participants.vue'
import staff from '../components/staff.vue'

import QuestionDetail from '../components/QuestionDetails.vue'
import store from '../store'; // Import your Vuex store
import Setting from '../components/setting.vue'
import ContestantChart from '../components/ContestantChart.vue'
import Users from '../components/Users.vue'
import FeedbackResponse from '../components/Fresponse.vue'
import QuestionResponse from '../components/QuestionDetails.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Setting,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/cchart',
    name: 'cchart',
    component: ContestantChart,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/participants',
    name: 'Participants',
    component: Participants,
    meta: { requiresAuth: true }
  },
  {
    path: '/staff',
    name: 'staff',
    component: staff,
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/feedback',
  //   name: 'feedback',
  //   component: Feedback,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/feedbacks',
    name: 'feedbacks',
    component: Feedbacks,
    meta: { requiresAuth: true }
  },
  {
    path: '/feedbacks/:id',
    name: 'Fresponse',
    component: FeedbackResponse,
    meta: { requiresAuth: true }
  },
  {
    path:"/questions",
    name: 'question',
    component: Question,
    meta: { requiresAuth: true }
  },
  {
    path:"/questions/:id",
    name: 'QuestionResponse',
    component: QuestionResponse,
    meta: { requiresAuth: true }
  },
  {
    path:"/polling",
    name:"polling",
    component: Polling,
    meta: { requiresAuth: true }
  },
  {
    path:"/polls/:id",
    name:"pollDetail",
    component: PollDetail,
    meta: { requiresAuth: true }
  },
  {
    path:"/pollanalysis",
    name:"pollAnalysis",
    component: PollAnalysis,
    meta: { requiresAuth: true }
  },
  {
    path: "/movie/:id",
    name:"MovieDetail",
    component: MovieDetail,
    meta: { requiresAuth: true }
  },
  {
    path: "/actor/:id",
    name:"actor",
    component: ActorDetail,
    meta: { requiresAuth: true }
  },
  {
    path: "/table",
    name:"Table",
    component: Table,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name:"Login",
    component: Login,
    meta: { requiresGuest: true } // Add meta field to indicate that this route is only accessible to non-authenticated users
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/questions/:id',
    name: 'QuestionDetail',
    component: QuestionDetail,
    props: true // Pass route params as props
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!store.getters.isAuthenticated) {
      // User is not authenticated, redirect to login
      next('/login');
    } else {
      // User is authenticated, proceed to the route
      next();
    }
  } else if (to.meta.requiresGuest) {
    // Check if user is already authenticated
    if (store.getters.isAuthenticated) {
      // User is authenticated, redirect to home page
      next('/');
    } else {
      // User is not authenticated, proceed to the login page
      next();
    }
  } else {
    // For other routes, proceed to the route
    next();
  }
});

export default router
