import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import router from './router'
import './plugins/axios'
import './plugins/moreu'
import './plugins/moment'
import './plugins/element'
import './plugins/fileexplorer'
import './plugins/clipboard'
import './plugins/photoswipe'
import './plugins/plyr'

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
