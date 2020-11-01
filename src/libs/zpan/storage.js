/* eslint-disable no-console */
import '@/plugins/axios'

let storage = {
    list(query) {
        return window.axios.get(`/api/storages`, { params: query })
    },
    find(alias) {
        return window.axios.get(`/api/storages/${alias}`)
    },
    create(form) {
        return window.axios.post(`/api/storages`, form)
    },
    update(form) {
        return window.axios.put(`/api/storages/${form.id}`, form)
    },
    delete(id) {
        return window.axios.delete(`/api/storages/${id}`)
    },
}

export default storage;
