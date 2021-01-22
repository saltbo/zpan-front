
class User {

    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(query) {
        return this.axios.get(`/api/v1/users`, { params: query })
    }
}

export default User;
