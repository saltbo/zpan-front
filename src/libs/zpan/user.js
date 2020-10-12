/* eslint-disable no-console */
import '@/plugins/axios'

let user = {
    list() {
        return window.axios.get(`/api/users`)
    },
    myStorage() {
        return window.axios.get(`/api/users/me`)
    },
    storageUpdate(uid, max) {
        return window.axios.patch(`/api/users/${uid}/storage`, { max: max })
    },
}

export default user;
