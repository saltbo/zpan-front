import Vue from "vue";

let object = {
    storage: {}
}

export const store = Vue.observable(object);
export const mutations = {
    setStorage(storage) {
        store.storage = storage;
    }
}
