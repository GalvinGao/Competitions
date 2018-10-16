// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Antd from 'vue-antd-ui'
import 'vue-antd-ui/dist/antd.css'
import router from './router'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(VueCookie)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
