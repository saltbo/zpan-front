import Vue from 'vue'
import Clipboard from 'clipboard'

Vue.prototype.$clipboard = new Clipboard(".copy-link");