/* eslint-disable no-console */
import axios from './axios'

class zRecyclebin {

    list(params) {
        return new Promise((resolve, reject) => {
            axios.get('/api/recycles', { params: params }).then(ret => {
                let data = ret.data;
                resolve(data);
            }).catch(reject)
        })
    }

    recovery(alias) {
        return axios.put(`/api/recycles/${alias}`)
    }

    delete(alias) {
        return axios.delete(`/api/recycles/${alias}`)
    }

    clean() {
        return axios.delete(`/api/recycles`)
    }
}

export default zRecyclebin;
