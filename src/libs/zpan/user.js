/* eslint-disable no-console */
import '@/plugins/axios'

let user = {
    list(query) {
        return window.axios.get(`/api/users`, { params: query })
    },
    myStorage() {
        return window.axios.get(`/api/users/me`)
    },
    storageUpdate(uid, max) {
        return window.axios.patch(`/api/users/${uid}/storage`, { max: max })
    },
}

export default user;
