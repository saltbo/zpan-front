/* eslint-disable no-console */
import axios from './axios'

class zSystem {

    providers() {
        return axios.get(`/api/system/providers`)
    }

    optGet(name) {
        return axios.get(`/api/system/options/${name}`)
    }

    optSave(name, form) {
        return axios.put(`/api/system/options/${name}`, form)
    }
}

export default zSystem;
