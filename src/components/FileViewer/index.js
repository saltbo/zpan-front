import MediaViewer from './Media'
import PictureViewer from './Picture'
import PdfViewer from './PDF'
import { transfer } from '@/helper'

class Preview {
    view(type, obj, link) {
        switch (type) {
            case "media":
                transfer(MediaViewer)({ title: obj.name, url: link, type: obj.type })
                break;
            case "pdf":
                transfer(PdfViewer)({ title: obj.name, url: link })
                break;
            case "image":
                transfer(PictureViewer)({ title: obj.name, url: link })
                break;
            case "doc":
                window.open("http://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(link));
                break;
            default:
                console.log(type, obj, link)
        }
    }
}

export default Preview