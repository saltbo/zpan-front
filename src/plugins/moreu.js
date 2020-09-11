import Vue from 'vue';
import moreu from "moreu-jssdk";

const Moreu = {}

Moreu.install = function (Vue, options) {
    Vue.moreu = moreu;
    window.moreu = moreu;
    Object.defineProperties(Vue.prototype, {
        moreu: {
            get() {
                return moreu;
            }
        },
        $moreu: {
            get() {
                return moreu;
            }
        },
    });
};

Vue.use(Moreu);

export default Moreu;