/* eslint-disable no-console */
class zStorage {

    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(query) {
        return this.axios.get(`/api/storages`, { params: query })
    }

    find(alias) {
        return this.axios.get(`/api/storages/${alias}`)
    }

    create(form) {
        return this.axios.post(`/api/storages`, form)
    }

    update(form) {
        return this.axios.put(`/api/storages/${form.id}`, form)
    }

    delete(id) {
        return this.axios.delete(`/api/storages/${id}`)
    }
}

export default zStorage;
