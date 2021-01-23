/* eslint-disable no-console */
import axios from './axios'
import Qs from "qs";

class User {

    list(query) {
        return axios.get(`/api/users`, {
            params: query,
            paramsSerializer: function (params) {
                return Qs.stringify(params, { arrayFormat: 'repeat' })
            },
        })
    }

    myStorage() {
        return axios.get(`/api/user/storage`)
    }

    storageUpdate(id, max) {
        return axios.patch(`/api/users/${id}/storage`, { max: max })
    }

}

export default User;
