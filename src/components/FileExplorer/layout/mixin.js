const mixin = {
    props: {
        value: Array,
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
}

export default mixin