import MediaViewer from './Media'
import PictureViewer from './Picture'
import { transfer } from '@/helper'

class Preview {
    view(type, obj, link) {
        switch (type) {
            case "media":
                transfer(MediaViewer)({ title: obj.name, url: link, type: obj.type })
                break;
            case "image":
                transfer(PictureViewer)({ title: obj.name, url: link })
                break;
            case "pdf":
                window.open(`/viewer/pdf?link=${encodeURIComponent(link)}&title=${obj.name}`, '_blank')
                break;
            case "doc":
                window.open("http://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(link));
                break;
            case "text":
                window.open(`/f/editor?alias=${obj.alias}`, '_blank')
                break;
            default:
                console.log(type, obj, link)
        }
    }
}

export default Preview