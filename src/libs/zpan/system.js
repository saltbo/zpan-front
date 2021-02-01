/* eslint-disable no-console */
import axios from './axios'

class zSystem {

    installDatabase(database) {
        return axios.put(`/system/database`, database)
    }

    createAdministrator(user) {
        return axios.put(`/system/account`, user)
    }

    optGet(name) {
        return axios.get(`/system/options/${name}`)
    }

    optSave(name, form) {
        return axios.put(`/system/options/${name}`, form)
    }

    providers() {
        return axios.get(`/system/providers`)
    }
}

export default zSystem;
