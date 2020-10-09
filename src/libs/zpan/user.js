/* eslint-disable no-console */
import '@/plugins/axios'

let user = {
    list() {
        return window.axios.get(`/api/users`)
    },
    myStorage() {
        return window.axios.get(`/api/users/me`)
    },
}

export default user;
