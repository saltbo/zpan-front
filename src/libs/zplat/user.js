
import axios from './axios'

class User {

    list(query) {
        return axios.get(`/api/v1/users`, { params: query })
    }
}

export default User;
