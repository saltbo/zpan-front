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
        onNameClick(item) {
            // open a folder
            if (item.dirtype) {
                this.$emit("on-click", 'folder', item)
                return;
            }

            // preview pdf file
            if (item.type.endsWith("pdf")) {
                this.$emit("on-click", 'pdf', item)
                return;
            }

            // preview image file
            if (item.type.startsWith("text")) {
                this.$emit("on-click", 'text', item)
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
            // if (this.isOfficeFile(item.type)) {
            //     this.$emit("on-click", 'doc', item)
            //     return;
            // }
        },
    }
}

export default mixin