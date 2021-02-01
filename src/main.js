import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import './plugins/axios'
import './plugins/moment'
import './plugins/element'
import './plugins/fileexplorer'
import './plugins/clipboard'
import './plugins/photoswipe'
import './plugins/plyr'
import './plugins/zpan'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
