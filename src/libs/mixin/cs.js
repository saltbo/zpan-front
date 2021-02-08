
const Mixin = {
    data() {
        return {
            cs: {}
        }
    },
    watch: {
        $route(newVal, oldVal) {
            this.setCs()
        },
    },
    computed: {},
    methods: {
        setCs() {
            this.$store.state.storages.forEach((ele) => {
                if (ele.name == this.$route.params.sname) {
                    this.cs = ele
                }
            });
        },
        getSid() {
            return this.cs.id
        },
    },
    mounted() {
        this.setCs()
    },
}

export default Mixin