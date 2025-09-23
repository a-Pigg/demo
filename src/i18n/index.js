import Vue from "vue";
import VueI18n from "vue-i18n";
//引入自定义语言配置  
import zh from './lan/zh'
import en from './lan/en'
//引入UI框架语言配置---elementui
import ElementLocale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

ElementLocale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换
Vue.use(VueI18n); // 全局注册国际化包

export const i18n = new VueI18n({
    locale: localStorage.getItem("locale") || "en", // 从localStorage中获取 默认英文
    messages: {
        // 中文语言包
        zh: {
            ...zh,
            ...zhLocale
        },
        //英文语言包
        en: {
            ...en,
            ...enLocale
        }
    },
});

export default i18n;