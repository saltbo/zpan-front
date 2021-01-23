/* eslint-disable no-console */
import axios from './axios'

class zShare {

    list(query) {
        return axios.get(`/api/shares`, { params: query })
    }

    find(alias) {
        return axios.get(`/api/shares/${alias}`)
    }

    create(body) {
        return axios.post(`/api/shares`, body)
    }

    draw(alias, drawcode) {
        return axios.post(`/api/shares/${alias}/token`, { secret: drawcode })
    }

    findMatter(alias) {
        return axios.get(`/api/shares/${alias}/matter`)
    }

    listMatters(alias, query) {
        return axios.get(`/api/shares/${alias}/matters`, { params: query })
    }
}

export default zShare;
