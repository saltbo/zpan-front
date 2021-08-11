/* eslint-disable no-console */
import utils from '../utils'
import axios from './axios'

class zMatter {

    upload(sid, fileObj, distDir, cancel) {
        let file = fileObj.file
        let body = { sid: sid, name: fileObj.filename, type: file.type, size: file.size, dir: distDir };
        return new Promise((resolve, reject) => {
            axios.post('/matters', body).then(ret => {
                let data = ret.data
                utils.upload(fileObj, data.link, data.headers, cancel).then(() => {
                    axios.patch(`/matters/${data.alias}/done`).then((ret) => {
                        resolve(ret.data)
                    })
                }).catch(reject)
            }).catch(reject)
        })
    }

    get(alias) {
        return new Promise((resolve, reject) => {
            axios.get(`/matters/${alias}`).then(ret => {
                resolve(ret.data)
            }).catch(reject)
        })
    }

    download(alias) {
        return new Promise((resolve, reject) => {
            this.get(alias).then(ret => {
                utils.download(ret.name, ret.url).then(() => {
                    resolve(ret)
                }).catch(reject)
            })
        })
    }

    list(params) {
        return new Promise((resolve, reject) => {
            axios.get('/matters', { params: params }).then(ret => {
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
    }

    rename(alias, name) {
        return axios.patch(`/matters/${alias}/name`, { name: name })
    }

    move(alias, newDir) {
        return axios.patch(`/matters/${alias}/location`, { dir: newDir })
    }

    copy(alias, newPath) {
        return axios.patch(`/matters/${alias}/duplicate`, { path: newPath })
    }

    delete(alias) {
        return axios.delete(`/matters/${alias}`)
    }

    save(alias, content) {
        return new Promise((resolve, reject) => {
            axios.get(`/matters/${alias}/ulink`).then(ret => {
                let data = ret.data
                window.axios.put(data.link, content, { headers: data.headers }).then(() => {
                    axios.patch(`/matters/${alias}/done`).then((ret) => {
                        resolve(ret.data)
                    })
                }).catch(reject)
            }).catch(reject)
        })
    }
}

export default zMatter;
