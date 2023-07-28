<template>
    <div class="toast">
        <template v-for="(item, index) in $store.state.msgPool">
            <div class="d-flex justify-center" transition="slide-y-transition" :key="index">
                <template v-if="item.light == false" transition="scale-transition">
                    <v-alert dense :type="item.type">{{ item.message }}</v-alert>
                </template>
                <template v-if="item.light == true" transition="scale-transition">
                    <v-alert dense :type="item.type" outlined>{{ item.message }}</v-alert>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visable: false,
            timeout: 3000,
            type: "info",
            color: "green",
            msg: ""
        }
    },
    methods: {
        success(data) { this.show("success", data) },
        error(data) { this.show("error", data) },
        info(data) { this.show("info", data) },
        warning(data) { this.show("warning", data) },
        show(type, data) {
            this.$store.commit("message", {
                type: type,
                message: data.message ? data.message : data,
                time: data.time ? data.time : 3000,
                light: data.light ? data.light : false
            })
        },
    },
    mounted() {
        console.log(1111, this.$store)
        this.success("test success")
    }
}
</script>

<style>
.toast {
    top: 30px;
    left: 50%;
    z-index: 9999;
    display: flex;
    position: fixed;
    min-width: 300px;
    max-width: 460px;
    flex-direction: column;
    transform: translateX(-50%);
}
</style>