/* eslint-disable no-console */
import '@/plugins/axios'

let recyclebin = {
    list(params) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/recycles', { params: params }).then(data => {
                resolve(data.data.list.map(item => {
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dirtype) item.fullpath += '/'
                    return item
                }));
            }).catch(reject)
        })
    },
    delete(alias) {
        return window.axios.delete(`/api/folders/${alias}`)
    }
}

export default recyclebin;
