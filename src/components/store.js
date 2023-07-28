import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        msgPool: []
    },
    mutations: {
        message(state, step) {
            state.msgPool.push(step)
            //将消息添加到消息列表
            setTimeout(() => {
                state.msgPool.shift()
            }, step.time);
            //清除消息
        }
    },
    actions: {
    },
    modules: {
    }
})
