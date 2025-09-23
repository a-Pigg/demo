"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);
// axios.defaults.baseURL = "http://192.168.11.249:20174/v1.1/"

// 1.添加请求拦截
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 请求前可以做一些事
    return config;
  },
  function (error) {
    // 请求错误做的事
    // Do something with request error
    return Promise.reject(error);
  }
);

// 2.添加响应拦截
// Add a response interceptor
_axios.interceptors.response.use(
  // 成功
  function (response) {
    // Do something with response data
    return response;
  },
  // 失败
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
