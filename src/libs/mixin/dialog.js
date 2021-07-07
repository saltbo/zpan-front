const DialogMixin = {
    data() {
        return {
            visible: false
        }
    },
    watch: {
        visible(val) {
            !val && this.$destroy()
        }
    },
    mounted() {
        document.body.appendChild(this.$el)
        this.visible = true
    },
    destroyed() {
        this.$el.parentNode.removeChild(this.$el)
    },
    methods: {
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        completed() {
            this.$emit('completed');
        },
        finish() {
            this.close();
            this.completed();
        },
    }
}

export default DialogMixin