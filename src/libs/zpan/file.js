/* eslint-disable no-console */
import utils from '../utils'
import axios from './axios'

class zFile {

    upload(sid, fileObj, distDir) {
        let file = fileObj.file
        let body = { sid: sid, name: fileObj.filename, type: file.type, size: file.size, dir: distDir };
        return new Promise((resolve, reject) => {
            axios.post('/files', body).then(ret => {
                let data = ret.data
                utils.upload(fileObj, data.link, data.headers).then(() => {
                    axios.patch(`/files/${data.alias}/uploaded`).then((ret) => {
                        resolve(ret)
                    })
                }).catch(reject)
            }).catch(reject)
        })
    }

    findLink(alias) {
        return new Promise((resolve, reject) => {
            axios.get(`/files/${alias}`).then(ret => {
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

    listObjects(params) {
        return new Promise((resolve, reject) => {
            axios.get('/files', { params: params }).then(ret => {
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
        return axios.patch(`/files/${alias}/name`, { name: name })
    }

    move(alias, newDir) {
        return axios.patch(`/files/${alias}/location`, { dir: newDir })
    }

    copy(alias, newPath) {
        return axios.patch(`/files/${alias}/duplicate`, { path: newPath })
    }

    delete(alias) {
        return axios.delete(`/files/${alias}`)
    }
}

export default zFile;
