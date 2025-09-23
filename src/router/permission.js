import router from "./index"; //router
import store from "@/store";
import "nprogress/nprogress.css";
import { i18n } from "@/i18n/index";
import NProgress from "nprogress";
NProgress.configure({ showSpinner: false }); // NProgress Configuration
import { getCookie, clearCookie } from "@/utils/Cookie";
import { MessageBox } from "element-ui";
router.beforeEach((to, form, next) => {
  NProgress.start();
  const PHONE = store.state.userInfo.phone;
  const ACCESSTOKEN = store.state.userInfo.token;
  const SYSTEMLIST = store.state.systemList;
  const COMPANYNAME = sessionStorage.getItem("loginCompanyName");
  const REFRESHTOKEN = getCookie(encodeURIComponent(COMPANYNAME + PHONE));
  if (!ACCESSTOKEN) {
    // console.log("没有token，即未登录");
    // 没有token，即未登录
    // requiresAuth为true需要检测，
    if (
      to.matched.length > 0 &&
      !to.matched.some((record) => record.meta.requiresAuth)
    ) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (!REFRESHTOKEN) {
    // next({ name: "Login" });
    if (
      to.matched.length > 0 &&
      !to.matched.some((record) => record.meta.requiresAuth)
    ) {
      next();
    } else {
      MessageBox.alert(i18n.t('h.tips227'), i18n.t("h.title18"),
        {
          confirmButtonText: i18n.t("h.confirmBtn"),
          callback: () => {
            clearCookie(encodeURIComponent(COMPANYNAME + PHONE));
            sessionStorage.clear();
            window.location.reload();
          },
        });
    }
  } else {
    // console.log("获取到token");
    // 获取到token
    if (!SYSTEMLIST.length) {
      // console.log("没有获取到路由表");
      // 没有获取到路由表
      next({ name: "Login" });
    } else {
      // console.log("获取到路由表");
      if (to.matched.length == 0) {
        // 刷新重新添加
        store.commit("SET_PERMISSION", store.state.systemList);
        next({ ...to, replace: true });
      }
      // 获取到路由表
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
