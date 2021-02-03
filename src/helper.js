import Vue from 'vue'
import i18n from './i18n'
import store from './store'

export const transfer = component => {
    const _constructor = Vue.extend(component)
    return function (propsData = {}) {
        console.log(propsData)
        let instance = new _constructor({ i18n, store, propsData }).$mount(document.createElement('div'))

        return new Promise((resolve, reject) => {
            instance.$once('completed', data => resolve(data))
            instance.$once('cancel', data => reject(data))
        })
    }
}