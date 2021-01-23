import Vue from 'vue';
import zpan from "../libs/zpan";

const Zpan = {
}

Zpan.install = function (Vue, options) {
    Vue.zpan = zpan;
    window.zpan = zpan;
    Object.defineProperties(Vue.prototype, {
        zpan: {
            get() {
                return zpan;
            }
        },
        $zpan: {
            get() {
                return zpan;
            }
        },
    });
};

Vue.use(Zpan);

export default Zpan;