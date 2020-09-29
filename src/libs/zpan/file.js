/* eslint-disable no-console */
import '@/plugins/axios'
import utils from '../utils'

let zpan = {
    upload(fileObj, distDir, publiced) {
        if (!publiced) {
            publiced = false
        }
        let file = fileObj.file
        let body = { name: fileObj.filename, type: file.type, size: file.size, dir: distDir, public: publiced };
        return new Promise((resolve, reject) => {
            window.axios.post('/api/files', body).then(ret => {
                let data = ret.data
                utils.upload(fileObj, data.link, data.headers).then(() => {
                    window.axios.patch(`/api/files/${data.alias}/uploaded`).then((ret) => {
                        resolve(ret)
                    })
                })
            }).catch(reject)
        })
    },
    findLink(alias) {
        return new Promise((resolve, reject) => {
            window.axios.get(`/api/files/${alias}`).then(ret => {
                resolve(ret.data)
            }).catch(reject)
        })
    },
    download(alias) {
        return new Promise((resolve, reject) => {
            this.findLink(alias).then(ret => {
                utils.download(ret.name, ret.link).then(() => {
                    resolve(ret)
                }).catch(reject)
            })
        })
    },
    listObjects(params) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/files', { params: params }).then(ret => {
                let data = ret.data
                data.list = data.list.map(item => {
                    item.size = utils.formatBytes(item.size, 1);
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dirtype) item.fullpath += '/'
                    return item
                })
                resolve(data);
            }).catch(reject)
        })
    },
    rename(alias, name) {
        return window.axios.patch(`/api/files/${alias}/name`, { name: name })
    },
    move(alias, newDir) {
        return window.axios.patch(`/api/files/${alias}/location`, { dir: newDir })
    },
    copy(alias, newPath) {
        return window.axios.patch(`/api/files/${alias}/duplicate`, { path: newPath })
    },
    delete(alias) {
        return window.axios.delete(`/api/files/${alias}`)
    }
}

export default zpan;
