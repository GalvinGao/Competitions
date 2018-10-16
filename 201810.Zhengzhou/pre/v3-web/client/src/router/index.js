import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Diary from '@/components/Diary'
import Weekly from '@/components/Weekly'
import Add from '@/components/Add'
import Login from '@/components/Login'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/diary/:id',
      name: 'Diary by ID',
      component: Diary
    }, {
      path: '/weekly/:id',
      name: 'Weekly Report by ID',
      component: Weekly
    }, {
      path: '/admin/add',
      name: 'Add new post',
      component: Add
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
