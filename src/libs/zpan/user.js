/* eslint-disable no-console */
import '@/plugins/axios'

let user = {
    myStorage() {
        return window.axios.get(`/api/users/me`)
    },
}

export default user;
