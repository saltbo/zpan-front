import '@/plugins/axios'

let utils = {
    objectURL(obj) {
        return new Promise((resolve, reject) => {
            let params = { object: obj.parent + obj.name, type: obj.type, parent: obj.parent };
            window.axios.get('/api/urls/download', { params: params }).then(ret => {
                resolve(ret.data.data)
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
                resolve(ret.data.list.map(item => { item.size = this.formatBytes(item.size, 1); return item }));
            }).catch(reject)
        })
    },
}

export default utils;
