import MediaViewer from './Media'
import PictureViewer from './Picture'
import { transfer } from '@/helper'

const streamTypeOpeners = {
    "audio": openMediaPlayer,
    "video": openMediaPlayer,
    "image": openImageViewer,
    "text": openEditor,
}

const extTypeOpeners = {
    "pdf": openPDFViewer,
    "json": openEditor,
    "yaml": openEditor,
    "x-yaml": openEditor,
    "msword": openOfficeEditor,
    "vnd.ms-excel": openOfficeEditor,
    "vnd.ms-powerpoint": openOfficeEditor,
    "vnd.openxmlformats-officedocument.wordprocessingml.document": openOfficeEditor,
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": openOfficeEditor,
    "vnd.openxmlformats-officedocument.presentationml.presentation": openOfficeEditor,
}

function openMediaPlayer(obj, link) {
    transfer(MediaViewer)({ title: obj.name, url: link, type: obj.type })
}
function openImageViewer(obj, link) {
    transfer(PictureViewer)({ title: obj.name, url: link })
}
function openPDFViewer(obj, link) {
    window.open(`/viewer/pdf?link=${encodeURIComponent(link)}&title=${obj.name}`, '_blank')
}
function openEditor(obj, link) {
    window.open(`/f/editor?alias=${obj.alias}`, '_blank')
}
function openOfficeEditor(obj, link) {
    window.open("http://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(link));
}

class Preview {

    linkLoader;

    constructor(linkLoader) {
        this.linkLoader = linkLoader
    }

    view(obj) {
        let [t1, t2] = obj.type.split('/')
        if (Object.keys(streamTypeOpeners).includes(t1)) {
            this.linkLoader(obj).then(link => {
                streamTypeOpeners[t1](obj, link)
            })
            return
        }

        if (Object.keys(extTypeOpeners).includes(t2)) {
            this.linkLoader(obj).then(link => {
                extTypeOpeners[t2](obj, link)
            })
            return
        }

        console.log(obj.name, t1, t2)
    }
}

export default Preview