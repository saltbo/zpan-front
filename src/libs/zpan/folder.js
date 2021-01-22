/* eslint-disable no-console */
import '@/plugins/axios'

class zFolder {

    axios

    constructor(_axios) {
        this.axios = _axios
    }

    list(params) {
        return new Promise((resolve, reject) => {
            this.axios.get('/api/folders', { params: params }).then(data => {
                resolve(data.data.list.map(item => {
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dirtype) item.fullpath += '/'
                    return item
                }));
            }).catch(reject)
        })
    }

    create(body) {
        return this.axios.post(`/api/folders`, body)
    }

    rename(alias, name) {
        return this.axios.patch(`/api/folders/${alias}/name`, { name: name })
    }

    move(alias, newDir) {
        return this.axios.patch(`/api/folders/${alias}/dir`, { dir: newDir })
    }

    delete(alias) {
        return this.axios.delete(`/api/folders/${alias}`)
    }
}

export default zFolder;
