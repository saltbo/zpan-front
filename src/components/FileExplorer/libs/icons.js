export default function buildIcon(matter) {
    if (matter.dirtype > 0) {
        matter.icon = { name: 'folder', color: '#ffc402' }
        return matter
    }


    let type = matter.type
    let [t1, t2] = type.split('/')
    console.log(type, '=>', t1, t2)

    let t1Icons = {
        audio: { name: 'book-music', color: 'rgb(55, 159, 211)' },
        video: { name: 'file-video', color: 'rgb(128, 149, 255)' },
        image: { name: 'file-image', color: 'rgb(18, 150, 219)' },
        text: { name: 'file-document', color: 'rgb(13, 71, 161)' },
        zip: { name: 'zip-box', color: 'rgb(244, 196, 70)' },
        'x-zip': { name: 'zip-box', color: 'rgb(244, 196, 70)' },
        json: { name: 'code-json', color: '' },
        xml: { name: 'xml', color: '' },
    }

    let t2Icons = {
        pdf: { name: 'file-pdf-box', color: '' },
        psd: { name: 'file-psd', color: '' },
        rtf: { name: 'file-rtf', color: '' },
        markdown: { name: 'language-markdown', color: '' },
        xml: { name: 'xml', color: '' },
        'msword': { name: 'file-word', color: '' },
        'vnd.ms-excel': { name: 'file-excel', color: '' },
        'vnd.ms-powerpoint': { name: 'file-powerpoint', color: '' },
        'vnd.openxmlformats-officedocument.wordprocessingml.document': { name: 'file-word', color: '' },
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': { name: 'file-excel', color: '' },
        'vnd.openxmlformats-officedocument.presentationml.presentation': { name: 'file-powerpoint', color: '' },
    }

    if (Object.keys(t2Icons).includes(t2)) {
        matter.icon = t2Icons[t2]
    } else if (Object.keys(t1Icons).includes(t1)) {
        matter.icon = t1Icons[t1]
    } else {
        matter.icon = { name: 'file', color: '#c9c9c9' }
    }

    return matter
}