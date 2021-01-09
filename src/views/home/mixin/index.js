const Mixin = {
    data() {
        return {
            sid: ""
        }
    },
    watch: {
        $route(newVal, oldVal) {
            this.sid = localStorage.getItem(`bucket-${newVal.params.sname}`);
        },
    },
    methods: {
        getSid() {
            return Number(this.sid)
        },
    },
    mounted() {
        this.sid = localStorage.getItem(`bucket-${this.$route.params.sname}`);
    },
}

export default Mixin