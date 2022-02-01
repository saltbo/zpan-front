<template>
    <v-overlay :value="overlay" v-bind="options.overlayProps">
        <v-progress-circular v-bind="options.spinnerProps"></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    inheritAttrs: true,
    props: {
        spinnerProps: Object,
        overlayProps: Object
    },
    data() {
        return {
            overlay: false,
            defaultProps: {
                spinnerProps: {
                    color: "primary",
                    value: 100,
                    indeterminate: true,
                    size: 80
                },
                overlayProps: {}
            },
            options: {
                spinnerProps: {},
                overlayProps: {}
            }
        };
    },
    methods: {
        show() {
            this.overlay = true;
        },
        hide() {
            this.overlay = false;
        },
        mergeProps() {
            //merge snipper props
            this.options.spinnerProps = {
                ...this.defaultProps.spinnerProps,
                ...this.$props.spinnerProps
            };
            //merge overlay props
            this.options.overlayProps = {
                ...this.defaultProps.overlayProps,
                ...this.$props.overlayProps
            };
        }
    },
    mounted() {
        this.mergeProps();
    }
};
</script>

<style></style>