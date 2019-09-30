import Vue from 'vue'
import Guest from './Guest.vue'
import router from './router'
import './plugins/axios'
import './plugins/element.js'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Guest)
}).$mount('#app')
