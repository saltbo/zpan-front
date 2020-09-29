/* eslint-disable no-console */
import '@/plugins/axios'

let recyclebin = {
    list(params) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/recycles', { params: params }).then(ret => {
                let data = ret.data;
                resolve(data);
            }).catch(reject)
        })
    },
    recovery(alias) {
        return window.axios.put(`/api/recycles/${alias}`)
    },
    delete(alias) {
        return window.axios.delete(`/api/recycles/${alias}`)
    },
    clean() {
        return window.axios.delete(`/api/recycles`)
    }
}

export default recyclebin;
