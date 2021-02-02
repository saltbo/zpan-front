
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
    updateStorage(username, body) {
        return axios.put(`/users/${username}/storage`, body)
    }
    find(username) {
        return axios.get(`/users/${username}`)
    }
    list(query) {
        return axios.get(`/users`, { params: query })
    }
}

export default User;
