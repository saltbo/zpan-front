/* eslint-disable no-console */
import axios from './axios'

class zFolder {

    list(params) {
        return new Promise((resolve, reject) => {
            axios.get('/api/folders', { params: params }).then(data => {
                resolve(data.data.list.map(item => {
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dirtype) item.fullpath += '/'
                    return item
                }));
            }).catch(reject)
        })
    }

    create(body) {
        return axios.post(`/api/folders`, body)
    }

    rename(alias, name) {
        return axios.patch(`/api/folders/${alias}/name`, { name: name })
    }

    move(alias, newDir) {
        return axios.patch(`/api/folders/${alias}/dir`, { dir: newDir })
    }

    delete(alias) {
        return axios.delete(`/api/folders/${alias}`)
    }
}

export default zFolder;
