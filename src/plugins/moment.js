import Vue from 'vue'
import moment from 'moment';

Vue.prototype.$moment = moment;
Vue.filter('moment', function (value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString);
});

if (!String.prototype.moment) {
    String.prototype.moment = function (formatString) {
        formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
        return moment(this).format(formatString);
    };
}
