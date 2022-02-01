import Vue from "vue";
import vuetify from '@/plugins/vuetify'
import store from "./store"

const mount = (component, options) => {
    const _constructor = Vue.extend(component)
    const propsData = Object.assign({}, options);
    const instance = new _constructor({
        store,
        vuetify,
        propsData,
        mounted() {
            this.$nextTick(function () {
                document.getElementById("app").appendChild(this.$el)
            })
        },
        destroyed() {
            this.$el.parentNode.removeChild(this.$el)
        },
    });

    return instance.$mount(document.createElement('div'));
}


import ComponentToast from "./Toast"
import ComponentLoading from "./Loading"

export const Toast = (options = {}) => mount(ComponentToast, options);
export const Loading = (options = {}) => mount(ComponentLoading, options);