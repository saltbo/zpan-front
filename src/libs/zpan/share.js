/* eslint-disable no-console */
import '@/plugins/axios'

let share = {
    list(query) {
        return window.axios.get(`/api/shares`, { params: query })
    },
    find(alias) {
        return window.axios.get(`/api/shares/${alias}`)
    },
    create(body) {
        return window.axios.post(`/api/shares`, body)
    },
    draw(alias, drawcode) {
        return window.axios.post(`/api/shares/${alias}/token`, { secret: drawcode })
    },
    findMatter(alias) {
        return window.axios.get(`/api/shares/${alias}/matter`)
    },
    listMatters(alias, query) {
        return window.axios.get(`/api/shares/${alias}/matters`, { params: query })
    }
}

export default share;
