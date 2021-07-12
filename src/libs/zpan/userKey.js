
import axios from './axios'

class UserKey {
    create(name) {
        return axios.post('/user/keys', { name: name })
    }
    list(query) {
        return axios.get(`/user/keys`, { params: query })
    }
    find(name) {
        return axios.get(`/user/keys/${name}`)
    }
    delete(name) {
        return axios.delete(`/user/keys/${name}`)
    }
    resetSecret(name, body) {
        return axios.patch(`/user/keys/${name}/secret`, body)
    }
}

export default UserKey;
