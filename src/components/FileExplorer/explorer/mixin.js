const mixin = {
    props: {
        value: Array,
        loading: false,

        rowButtons: Array,
        moreButtons: Array
    },
    data() {
        return {
            data: [],
        }
    },
    watch: {
        value(nval, oval) {
            this.data = nval;
        },
    },
    methods: {
        isOfficeFile(type) {
            let officeTypes = ["application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
            return officeTypes.includes(type);
        },
        officeIcon(type) {
            let docTypes = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            let excelTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
            let pptTypes = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
            if (docTypes.includes(type)) {
                return 'icon-doc'
            } else if (excelTypes.includes(type)) {
                return 'icon-excel'
            } else if (pptTypes.includes(type)) {
                return 'icon-ppt'
            }

        },
        type2icon(type) {
            console.log(type)
            let [t1, t2] = type.split('/')
            let mt = ['pdf', 'html', 'xml', 'psd', 'rtf']
            if (mt.includes(t2)) {
                return `icon-${t2}`
            }

            let codeTypes = ['json', 'yaml', 'x-yaml']
            if (codeTypes.includes(t2)) {
                return 'icon-html'
            }

            let compressedFileTypes = ['zip', 'x-gzip']
            if (compressedFileTypes.includes(t2)) {
                return 'icon-compressed-file'
            }

            if (this.isOfficeFile(type)) {
                return this.officeIcon(type)
            }

            let gt = ['audio', 'video', 'image', 'text']
            if (gt.includes(t1)) {
                return `icon-${t1}`
            }

            return 'icon-file'
        },
        onNameClick(item) {
            // open a folder
            if (item.dirtype) {
                this.$emit("on-click", 'folder', item)
                return;
            }

            // preview image file
            if (item.type.startsWith("image")) {
                this.$emit("on-click", 'image', item)
                return;
            }

            // preview media file
            if (item.type.startsWith("audio") || item.type.startsWith("video")) {
                this.$emit("on-click", 'media', item)
                return;
            }

            // preview office file
            if (this.isOfficeFile(item.type)) {
                this.$emit("on-click", 'doc', item)
                return;
            }
        },
    }
}

export default mixin