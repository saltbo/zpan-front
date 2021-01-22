import Vue from 'vue';
import zplat from "../libs/zplat";

const Zplat = {
}

Zplat.install = function (Vue, options) {
    Vue.zplat = zplat;
    window.zplat = zplat;
    Object.defineProperties(Vue.prototype, {
        zplat: {
            get() {
                return zplat;
            }
        },
        $zplat: {
            get() {
                return zplat;
            }
        },
    });
};

Vue.use(Zplat);

export default Zplat;