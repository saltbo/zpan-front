import Vue from "vue";

const Bus = Vue.prototype.$EventBus = new Vue();

export default Bus
