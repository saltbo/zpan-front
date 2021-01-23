"use strict";

import axios from "axios";
import { Notification } from 'element-ui';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
    headers: { "X-Zplat-Subsystem": "zpan" }
};

const _axios = axios.create(config);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        if (error.response && error.response.status == 401) {
            this.location = "/zplat/signin"
            return Promise.reject("invalid login status");
        }

        let msg = error.message
        if (error.response) {
            msg = error.response.data.msg
        }

        Notification.error(msg)
        return Promise.reject(error);
    }
);

export default _axios