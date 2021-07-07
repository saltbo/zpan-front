
import axios from './axios'

class User {
    signup(body) {
        return axios.post('/users', body)
    }
    activate(email, token) {
        let body = { token: token, activated: true };
        return axios.patch(`/users/${email}`, body)
    }
    applyPasswordReset(email) {
        let body = { email: email };
        return axios.post('/tokens', body)
    }
    passwordReset(email, token, newpwd) {
        let body = { token: token, password: newpwd };
        return axios.patch(`/users/${email}`, body)
    }
    signin(body) {
        return axios.post('/tokens', body)
    }
    signout() {
        return axios.delete('/tokens')
    }
    profileGet() {
        return axios.get('/user')
    }
    updateProfile(body) {
        return axios.put('/user/profile', body)
    }
    updatePassword(body) {
        return axios.put('/user/password', body)
    }

    list(query) {
        return axios.get(`/users`, { params: query })
    }
    find(username) {
        return axios.get(`/users/${username}`)
    }
    delete(username) {
        return axios.delete(`/users/${username}`)
    }
    updatePasswordByUser(username, body) {
        return axios.put(`/users/${username}/password`, body)
    }
    updateStorageByUser(username, body) {
        return axios.put(`/users/${username}/storage`, body)
    }
    updateStatusByUser(username, body) {
        return axios.put(`/users/${username}/status`, body)
    }
}

export default User;
