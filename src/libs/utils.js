/* eslint-disable no-console */
import '@/plugins/axios'

let utils = {
    uploadURL(fileObj, distDir) {
        let file = fileObj.file
        let params = { name: fileObj.filename, type: file.type, size: file.size, dir: distDir };
        return new Promise((resolve, reject) => {
            window.axios.get('/api/urls/upload', { params: params }).then(ret => {
                resolve(ret.data.data)
            }).catch(reject)
        })
    },
    downloadURL(objectId) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/urls/download/' + objectId).then(ret => {
                resolve(ret.data.data)
            }).catch(reject)
        })
    },
    upload(fileObj, destURL, headers) {
        let file = fileObj.file
        return new Promise((resolve, reject) => {
            let options = { headers: headers };
            options.onUploadProgress = function (event) {
                file.percent = event.loaded / event.total * 100;
                if (fileObj.onProgress) fileObj.onProgress(file);
            }

            window.axios.put(destURL, file, options).then((ret) => {
                if (fileObj.onSuccess) fileObj.onSuccess();
                resolve(ret)
            }).catch(reject)
        })
    },
    download(name, url) {
        var a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
    },
    formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimals + 1 || 3,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    listObjects(params) {
        return new Promise((resolve, reject) => {
            window.axios.get('/api/files', { params: params }).then(ret => {
                resolve(ret.data.list.map(item => {
                    item.size = this.formatBytes(item.size, 1);
                    item.fullpath = `${item.parent}${item.name}`
                    if (item.dir) item.fullpath += '/'
                    return item
                }));
            }).catch(reject)
        })
    },
    setupPasteUpload(fileCallback) {
        document.addEventListener('paste', event => {
            let clipboardData = null
            if (event.clipboardData || event.originalEvent) { // 兼容问题
                clipboardData = event.clipboardData || event.originalEvent.clipboardData;
            }

            if (clipboardData && clipboardData.items) {
                event.preventDefault();  // 阻止默认行为

                let item = clipboardData.items[0]
                if (!item.type.startsWith('image')) {
                    return;
                }

                let file = item.getAsFile();
                let filename = file.name.replace('image', (new Date()).getTime())
                fileCallback({ file: file, filename: filename })
            }
        });
    }
}

export default utils;
