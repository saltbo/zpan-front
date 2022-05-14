import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: true,
  state: {
    storages: [],
    cs: {},
    files: [],
    uploading: false,
    uploadedCnt: 0,
    uListActive: false,
  },
  mutations: {
    updateFiles(state, files) {
      state.files = files
    },
    uploadedCntIncr(state) {
      state.uploadedCnt++
    },
    updateUploading(state, status) {
      state.uploading = status
    },
    setuListActive(state, active) {
      console.log(123123, active)
      state.uListActive = active
    },
    storages(state, storages) {
      state.storages = storages
    },
    cs(state, cs) {
      state.cs = cs
    }
  },
  actions: {}
})
