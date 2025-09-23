import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/permission";
import store from "./store";
import "./plugins/axios";
import "./plugins/element";
import "./theme/element/index.css";
import "element-ui/lib/theme-chalk/base.css";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
import { i18n } from './i18n/index' //国际化

Vue.component(CollapseTransition.name, CollapseTransition);
// 消除警告 Added non-passive event listener to a scroll-blocking 'mousewheel' event.
//         Consider marking handler as 'passive' to make the page more responsive
import "default-passive-events";
// ECharts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
// svg
import "./assets/icons/index";
// 初始化css文件
import "./assets/css/reset.css";
// el-menu收缩文字不消失
import Fragment from "vue-fragment";
import * as directives from "./directive.js";
Vue.use(Fragment.Plugin, directives);

//引入图标库
import "./assets/font/iconfont.css";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
