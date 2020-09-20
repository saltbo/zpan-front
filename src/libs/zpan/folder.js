/* eslint-disable no-console */
import '@/plugins/axios'

let folder = {
    list(params) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/folders', { params: params }).then(data => {
                resolve(data.data.list.map(item => {
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dirtype) item.fullpath += '/'
                    return item
                }));
            }).catch(reject)
        })
    },
    create(body) {
        return window.axios.post(`/api/folders`, body)
    },
    rename(alias, name) {
        return window.axios.patch(`/api/folders/${alias}/name`, { name: name })
    },
    move(alias, newDir) {
        return window.axios.patch(`/api/folders/${alias}/dir`, { dir: newDir })
    },
    delete(alias) {
        return window.axios.delete(`/api/folders/${alias}`)
    }
}

export default folder;
