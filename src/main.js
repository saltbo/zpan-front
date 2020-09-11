import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/axios'
import './plugins/moreu'
import './plugins/moment'
import './plugins/element'
import './plugins/clipboard'
import './plugins/photoswipe'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
