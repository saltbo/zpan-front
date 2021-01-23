/* eslint-disable no-console */
import axios from './axios'

class zStorage {

    list(query) {
        return axios.get(`/api/storages`, { params: query })
    }

    find(alias) {
        return axios.get(`/api/storages/${alias}`)
    }

    create(form) {
        return axios.post(`/api/storages`, form)
    }

    update(form) {
        return axios.put(`/api/storages/${form.id}`, form)
    }

    delete(id) {
        return axios.delete(`/api/storages/${id}`)
    }
}

export default zStorage;
