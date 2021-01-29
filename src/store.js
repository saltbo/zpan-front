import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    storages: [],
    cs: {}
  },
  mutations: {
    storages(state, storages) {
      state.storages = storages
    },
    cs(state, cs) {
      state.cs = cs
    }
  },
  actions: {

  }
})
