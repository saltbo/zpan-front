/* eslint-disable no-console */

let utils = {
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
        return new Promise((resolve, reject) => {
            var a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
            resolve()
        })
    },
    formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals + 1 || 3,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    },

    bytesUnits() {
        const KB = 1024;
        const MB = 1024 * KB;
        const GB = 1024 * MB;
        const TB = 1024 * GB;
        const PB = 1024 * TB;
        const units = [
            { label: "KB", value: KB },
            { label: "MB", value: MB },
            { label: "GB", value: GB },
            { label: "TB", value: TB },
            { label: "PB", value: PB },
        ]
        return units
    },

    formatBytes2(bytes, decimals) {
        let object = {
            num: 0,
            unitLabel: "Bytes",
            unitValue: 0,

            format() {
                return `${object.num} ${object.unitLabel}`
            }
        };
        if (!bytes) {
            return object
        }

        let v = bytes;
        let idx = 0;
        for (; v >= 1024; idx++) {
            v = v / 1024;
        }

        let dm = decimals + 1 || 3
        object.num = parseFloat(v).toFixed(dm)
        object.unitLabel = this.bytesUnits()[idx - 1].label
        object.unitValue = this.bytesUnits()[idx - 1].value
        return Object.assign({}, object)
    }
}

export default utils;
