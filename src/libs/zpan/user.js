/* eslint-disable no-console */

class User {
    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(query) {
        return this.axios.get(`/api/users`, { params: query })
    }

    myStorage() {
        return this.axios.get(`/api/user/storage`)
    }

    update(id, max) {
        return this.axios.patch(`/api/users/${id}/storage`, { max: max })
    }

}

export default User;
