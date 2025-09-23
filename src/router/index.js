import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/Login",
    name: "Login",
    meta: {
      requiresAuth: false,
    },
    component: () => import("@/views/Login"),
  },
  {
    path: "/VersionEquity",
    name: "VersionEquity",
    meta: {
      requiresAuth: false,
    },
    component: () => import("@/views/VersionEquity"),
  },
  {
    path: "/Screen",
    name: "Screen",
    meta: {
      requiresAuth: false,
    },
    component: () => import("@/views/Screen"),
  }
];

// 准备动态加载的路由
export const DynamicRoutes = [
  {
    path: "/",
    name: "Layout",
    redirect: "Home",
    meta: {
      requiresAuth: true,
      name: "首页",
    },
    component: () => import("@/layout"),
    children: [
      {
        path: "/Home",
        name: "Home",
        meta: {
          name: "首页",
          icon: "iconfont icon-index ",
        },
        component: () => import("@/views/Analyse"),
      },
    ],
  },
  {
    path: "/403",
    meta: {
      requiresAuth: false,
    },
    component: () => import("@/views/ErrorPage/403.vue"),
  },
  {
    path: "*",
    meta: {
      requiresAuth: false,
    },
    component: () => import("@/views/ErrorPage/404.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
