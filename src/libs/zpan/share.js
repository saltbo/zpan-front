/* eslint-disable no-console */
class zShare {

    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(query) {
        return this.axios.get(`/api/shares`, { params: query })
    }

    find(alias) {
        return this.axios.get(`/api/shares/${alias}`)
    }

    create(body) {
        return this.axios.post(`/api/shares`, body)
    }

    draw(alias, drawcode) {
        return this.axios.post(`/api/shares/${alias}/token`, { secret: drawcode })
    }

    findMatter(alias) {
        return this.axios.get(`/api/shares/${alias}/matter`)
    }

    listMatters(alias, query) {
        return this.axios.get(`/api/shares/${alias}/matters`, { params: query })
    }
}

export default zShare;
