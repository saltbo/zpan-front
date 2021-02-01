/* eslint-disable no-console */
import axios from './axios'

class zRecyclebin {

    list(params) {
        return new Promise((resolve, reject) => {
            axios.get('/recycles', { params: params }).then(ret => {
                let data = ret.data;
                resolve(data);
            }).catch(reject)
        })
    }

    recovery(alias) {
        return axios.put(`/recycles/${alias}`)
    }

    delete(alias) {
        return axios.delete(`/recycles/${alias}`)
    }

    clean() {
        return axios.delete(`/recycles`)
    }
}

export default zRecyclebin;
