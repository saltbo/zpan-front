/* eslint-disable no-console */
import axios from './axios'

class zStorage {

    list(query) {
        return axios.get(`/storages`, { params: query })
    }

    find(alias) {
        return axios.get(`/storages/${alias}`)
    }

    create(form) {
        return axios.post(`/storages`, form)
    }

    update(form) {
        return axios.put(`/storages/${form.id}`, form)
    }

    delete(id) {
        return axios.delete(`/storages/${id}`)
    }
}

export default zStorage;
