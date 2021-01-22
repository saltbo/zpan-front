/* eslint-disable no-console */

class zRecyclebin {

    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(params) {
        return new Promise((resolve, reject) => {
            this.axios.get('/api/recycles', { params: params }).then(ret => {
                let data = ret.data;
                resolve(data);
            }).catch(reject)
        })
    }

    recovery(alias) {
        return this.axios.put(`/api/recycles/${alias}`)
    }

    delete(alias) {
        return this.axios.delete(`/api/recycles/${alias}`)
    }

    clean() {
        return this.axios.delete(`/api/recycles`)
    }
}

export default zRecyclebin;
