
const Mixin = {
    data() {
        return {
        }
    },
    watch: {
        $route(newVal, oldVal) { },
    },
    computed: {
        cs() {
            return this.$store.state.cs
        }
    },
    methods: {
        getSid() {
            return this.cs.id
        },
    },
    mounted() {
    },
}

export default Mixin