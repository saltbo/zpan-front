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