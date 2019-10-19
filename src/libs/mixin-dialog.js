const DialogMixin = {
    data() {
        return {
            visible: false
        }
    },
    methods: {
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        finish() {
            this.$emit('completed');
        },
    }
}

export default DialogMixin