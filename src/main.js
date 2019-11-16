import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/glabal.css'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'

import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
