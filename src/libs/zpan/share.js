/* eslint-disable no-console */
import '@/plugins/axios'

let share = {
    list(query) {
        return window.axios.get(`/api/shares`, { params: query })
    },
    find(alias, query) {
        return window.axios.get(`/api/shares/${alias}`, { params: query })
    },
    create(body) {
        return window.axios.post(`/api/shares`, body)
    }
}

export default share;
