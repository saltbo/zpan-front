/* eslint-disable no-console */
import utils from '../utils'
import axios from './axios'

class zMatter {

    upload(sid, fileObj, distDir, cancel) {
        let file = fileObj.file
        let body = { sid: sid, name: fileObj.filename, type: file.type, size: file.size, dir: distDir };
        return new Promise((resolve, reject) => {
            this.create(body).then(ret => {
                let data = ret.data
                utils.upload(fileObj, data.link, data.headers, cancel).then(() => {
                    axios.patch(`/matters/${data.alias}/done`).then((ret) => {
                        resolve(ret)
                    })
                }).catch(reject)
            }).catch(reject)
        })
    }

    findLink(alias) {
        return new Promise((resolve, reject) => {
            axios.get(`/matters/${alias}/link`).then(ret => {
                resolve(ret.data)
            }).catch(reject)
        })
    }

    download(alias) {
        return new Promise((resolve, reject) => {
            this.findLink(alias).then(ret => {
                utils.download(ret.name, ret.link).then(() => {
                    resolve(ret)
                }).catch(reject)
            })
        })
    }

    create(body) {
        return axios.post('/matters', body)
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
}

export default zMatter;
