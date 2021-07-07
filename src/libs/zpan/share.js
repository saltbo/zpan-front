/* eslint-disable no-console */
import axios from './axios'

class zShare {

    list(query) {
        return axios.get(`/shares`, { params: query })
    }

    find(alias) {
        return axios.get(`/shares/${alias}`)
    }

    create(body) {
        return axios.post(`/shares`, body)
    }

    remove(alias) {
        return axios.delete(`/shares/${alias}`)
    }

    draw(alias, drawcode) {
        return axios.post(`/shares/${alias}/token`, { secret: drawcode })
    }

    findMatter(alias) {
        return axios.get(`/shares/${alias}/matter`)
    }

    listMatters(alias, query) {
        return axios.get(`/shares/${alias}/matters`, { params: query })
    }
}

export default zShare;
