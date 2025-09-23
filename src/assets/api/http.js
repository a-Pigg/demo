import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
import store from "@/store";
import { MessageBox } from "element-ui";
import { i18n } from "@/i18n/index";
import { getCookie, clearCookie, setCookie } from "@/utils/Cookie";
let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

//标志当前是否正在刷洗token
let isNotRefreshing = true;
//请求队列
let requests = [];
const _axios = axios.create(config);
// 请求拦截
_axios.interceptors.request.use(
  function (config) {
    // 请求前可以做一些事
    if (
      config.url.includes("select/manage") ||
      config.url.includes("update/manage") ||
      config.url.includes("delete/manage") ||
      config.url.includes("sync/manage")
    ) {
      if (typeof config.data == "string") {
        let test = JSON.parse(config.data);
        // let lan = localStorage.getItem("locale") || "en"
        // let lanStr = lan == "zh" ? '-zh_CN' : "-en_US"
        // test["token"] = store.state.userInfo.token + lanStr;
        test["token"] = store.state.userInfo.token;
        config.data = test;
      }
      return config;
    } else if (
      config.url.includes("/Service/") &&
      !getCookie(
        encodeURIComponent(
          window.sessionStorage.getItem("loginCompanyName") +
          store.state.userInfo.phone
        )
      ) &&
      store.state.userInfo.token
    ) {
      let errorMsg = { msg: "cancelCache" + Math.random(), data: [] };
      config.cancelToken = source.token;
      // 这一行的作用是每次传递的errorMsg都是不一样的，如果没有这一行，那么，即使source.cancel(errorMsg)中有传递不同的参数，接收的时候也是一样的
      source.token.reason = errorMsg;
      // cancel函数可以不用传参，也可以传入取消后执行的操作，取消后可提示用户需要登录
      source.cancel(errorMsg);
      clearCookie(
        encodeURIComponent(
          window.sessionStorage.getItem("loginCompanyName") +
          store.state.userInfo.phone
        )
      );
      sessionStorage.clear();
      MessageBox.alert(i18n.t('h.tips227'), i18n.t("h.title18"),
        {
          confirmButtonText: i18n.t("h.confirmBtn"),
          callback: () => {
            window.location.reload();
          },
        });
      return config;
    } else if (config.url.includes("getToken")) {
      return config;
    } else {
      return config;
    }
  },
  function (error) {
    // 请求错误做的事
    return Promise.reject(error);
  }
);
// 响应拦截
// Add a response interceptor
_axios.interceptors.response.use(
  // 成功
  (res) => {
    // console.log(res);
    //我们可以定义一个标准响应体，比如：{code=409,msg='token已过期',data:null}，当收到token过期的响应就要进行token刷新了
    if (
      res.data.code == 409 &&
      (res.config.url.includes("select/manage") ||
        res.config.url.includes("update/manage") ||
        res.config.url.includes("delete/manage") ||
        res.config.url.includes("sync/manage"))
    ) {
      //首先拿到响应的配置参数，这和请求的配置参数是一样的，包括了url、data等信息，待会需要使用这个config来进行重发
      const config = res.config;
      let lan = localStorage.getItem("locale") || "en";
      let lanStr = lan == "zh" ? 'zh_CN' : "en_US";
      //如果当前不处于刷新阶段就进行刷新操作
      if (isNotRefreshing) {
        isNotRefreshing = false;
        //返回刷新token的回调的返回值，本来考虑到由于请求是异步的，所以return会先执行，导致返回一个undefined，那么就需要使用async+await，但实际上没有加也成功了
        return _axios
          .post(window.$BAER_URL.getToken, {
            token: getCookie(
              encodeURIComponent(
                window.sessionStorage.getItem("loginCompanyName") +
                store.state.userInfo.phone
              )
            ),
            language: lanStr,
          })
          .then((res) => {
            // console.log(res);
            if (res.data.code == 409) {
              clearCookie(
                encodeURIComponent(
                  window.sessionStorage.getItem("loginCompanyName") +
                  store.state.userInfo.phone
                )
              );
              sessionStorage.clear();
              MessageBox.alert(i18n.t('h.tips227'), i18n.t("h.title18"),
                {
                  confirmButtonText: i18n.t("h.confirmBtn"),
                  callback: () => {
                    window.location.reload();
                  },
                });
            } else if (res.data.code == 408) {
              clearCookie(
                encodeURIComponent(
                  window.sessionStorage.getItem("loginCompanyName") +
                  store.state.userInfo.phone
                )
              );
              sessionStorage.clear();
              MessageBox.alert(i18n.t(`h.${res.data.data}`), i18n.t("h.title18"),
                {
                  confirmButtonText: i18n.t("h.confirmBtn"),
                  callback: () => {
                    window.location.reload();
                  },
                });
            } else if (res.data.code == 0) {
              setCookie(
                encodeURIComponent(
                  window.sessionStorage.getItem("loginCompanyName") +
                  store.state.userInfo.phone
                ),
                res.data.data.refreshToken,
                localStorage.getItem("refres")
              );
              store.commit("SET_TOKEN", res.data.data.token);
              requests.forEach((run) => run());
              requests = [];
              return _axios(config);
            }
          })
          .catch(() => {
            clearCookie(
              encodeURIComponent(
                window.sessionStorage.getItem("loginCompanyName") +
                store.state.userInfo.phone
              )
            );
            sessionStorage.clear();
            MessageBox.alert(i18n.t("h.tips228"), i18n.t("h.title18"),
              {
                confirmButtonText: i18n.t("h.confirmBtn"),
                callback: () => {
                  window.location.reload();
                },
              });
          })
          .finally(() => {
            isNotRefreshing = true;
          });
      } else {
        //如果当前已经是处于刷新token的状态，就将请求置于请求队列中，这个队列会在刷新token的回调中执行，由于new关键子存在声明提升，所以不用顾虑会有请求没有处理完的情况，这段添加请求的程序一定会在刷新token的回调执行之前执行的
        return new Promise((resolve) => {
          //这里加入的是一个promise的解析函数，将响应的config配置对应解析的请求函数存到requests中，等到刷新token回调后再执行
          requests.push(() => {
            resolve(_axios(config));
          });
        });
      }
    } else {
      return res;
    }
  },
  // 失败
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
// 导出 get请求方法
export const get = (url, params, headers = {}) => {
  return new Promise((resolve, reject) => {
    _axios
      .get(url, {
        params,
        headers,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(res);
      });
  });
};
// 导出post请求方法
export const post = (url, params, data) => {
  return new Promise((resolve, reject) => {
    _axios
      .post(url, params, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(res);
      });
  });
};
// 打印
export const pPost = (url, method, params, data) => {
  return new Promise((resolve, reject) => {
    _axios({ url, method, params, data })
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(res);
      });
  });
};
