import Vue from "vue";
import Vuex from "vuex";
import persistedState from "vuex-persistedstate";
import router, { DynamicRoutes } from "@/router/index"; //router 主体
import dynamicRoutes from "@/router/dynamic-router"; //系统路由表
import { recursionRouter, setDefaultRoute } from "@/utils/recursion-router";
import { select } from "@/assets/api";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 个人信息
    userInfo: {},
    // 系统最大限制表
    maxLimit: {},
    // 路由表
    permissionList: [],
    // 菜单列表
    sidebarMenu: [],
    // 返回的信息表
    systemList: [],
    // 资产头信息
    assetFormHeader: [],
    assetTableHeader: [],
    // 自定义标签功能
    pathName: "",
    // 资产状态表
    stateListData: [],
    // 入库方式表
    storageMethodListData: [],
  },
  getters: {},
  mutations: {
    SET_TOKEN(state, token) {
      state.userInfo.token = token;
    },
    SET_USERINFO(state, userInfo) {
      // 国际化
      let lan = localStorage.getItem("locale") || "en"
      let lanStr = lan == "zh" ? '-zh_CN' : "-en_US"
      state.userInfo._id = userInfo._id;
      state.userInfo.token = userInfo.token + lanStr;
      state.userInfo.roleId = userInfo.roleId;
      state.userInfo.roleName = userInfo.roleName;
      state.userInfo.staffId = userInfo.staffId;
      state.userInfo.staffName = userInfo.staffName;
      state.userInfo.phone = userInfo.phone;
      state.userInfo.password = userInfo.password;
    },
    SET_MAXLIMIT(state, maxLimit) {
      state.maxLimit.assetExcelSize = maxLimit.assetExcelSize;
      state.maxLimit.pictureSize = maxLimit.pictureSize;
      state.maxLimit.assetLabelPrint = maxLimit.assetLabelPrint;
      state.maxLimit.openService = maxLimit.openService;
      state.maxLimit.date = maxLimit.date;
      state.maxLimit.useDate = maxLimit.useDate;
    },
    SET_PERMISSION(state, menu) {
      state.systemList = menu;
      // 对比路由，返回符合权限的路由
      let routes = recursionRouter(menu, dynamicRoutes);
      // 找到主界面的路由
      let MainContainer = DynamicRoutes.find((v) => v.path === "/");
      let children = MainContainer.children;
      children.push(...routes);
      // 生成菜单
      state.sidebarMenu = children;
      // 设置默认路由
      setDefaultRoute([MainContainer]);
      // 初始化中的路由
      let initialRoutes = router.options.routes;
      // 添加路由进去
      DynamicRoutes.forEach((item) => {
        router.options.routes.push(item);
        router.addRoute(item);
      });
      state.permissionList = [...initialRoutes];
    },
    SET_ASSETFORMHEADER(state, header) {
      state.assetFormHeader = header;
    },
    SET_ASSETTABLEHEADER(state, header) {
      state.assetTableHeader = header;
    },
    SET_ASSETSTATE(state, info) {
      state.stateListData = info.map((e) => {
        return {
          _id: e.key,
          label: e.value,
        }
      })
    },
    SET_STORAGEMETHOD(state, info) {
      state.storageMethodListData = info.map((e) => {
        return {
          _id: e.key,
          label: e.value,
        }
      })
    },
    LOGINOUT(state) {
      state.userInfo = {};
      state.maxLimit = {};
      state.permissionList = [];
      state.sidebarMenu = [];
      state.systemList = [];
    },
  },
  actions: {
    async GET_ASSETFORMHEADER(context) {
      const { data: res } = await select({
        func: "S0054",
        userId: context.state.userInfo._id,
        token: context.state.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      context.commit("SET_ASSETFORMHEADER", res.data);
    },
    async GET_ASSETTABLEHEADER(context, companyName) {
      const { data: res } = await select({
        func: "S0055",
        userId: context.state.userInfo._id,
        token: context.state.userInfo.token,
        requstData: {},
      });
      if (res.code != 0) return this.$message.error(res.data);
      if (companyName) {
        let highKey = companyName + context.state.userInfo._id
        // 思路：
        // 1.检测有没有符合要求的配置 检测localStorage
        let highFilterList = JSON.parse(localStorage.getItem(highKey))
        if (highFilterList) {
          // 有配置单 检测该配置单是否需要更新
          res.data.forEach(e => {
            if (e.attr != 'num' && e.attr != 'photo' && e.attr != 'file') {
              if (e.attr == 'type') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'classifyId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else if (e.attr == 'assertPosition') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'warehouseId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else if (e.attr == 'goodsName') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'goodsId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else if (e.attr == 'responsible') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'responsibleId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else if (e.attr == 'operator') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'staffId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else if (e.attr == 'useDept') {
                let itemIndex = highFilterList.findIndex(item => item.attr == 'deptId')
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              } else {
                let itemIndex = highFilterList.findIndex(item => item.attr == e.attr)
                if (itemIndex != -1) {
                  highFilterList[itemIndex].label = e.label
                } else {
                  highFilterList.push({
                    id: e.id,
                    label: e.label,
                    attr: e.attr,
                    hightFilter: true
                  })
                }
              }
            }
          })
          // 自定义字段的删减
          highFilterList.forEach((e, index) => {
            if (e.attr.length == 32) {
              let findI = res.data.findIndex(item => item.attr == e.attr)
              if (findI == -1) {
                highFilterList.splice(index, 1);
              }
            }
          })
          localStorage.setItem(highKey, JSON.stringify(highFilterList))
        } else {
          highFilterList = []
          // 没有配置单 则生成配置单并存储
          res.data.forEach(e => {
            if (e.attr != 'num' && e.attr != 'photo' && e.attr != 'file') {
              if (e.attr == 'type') {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'classifyId',
                  hightFilter: true
                })
              } else if (e.attr == "assertPosition") {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'warehouseId',
                  hightFilter: true
                })
              } else if (e.attr == "goodsName") {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'goodsId',
                  hightFilter: true
                })
              } else if (e.attr == "responsible") {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'responsibleId',
                  hightFilter: true
                })
              } else if (e.attr == "operator") {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'staffId',
                  hightFilter: true
                })
              } else if (e.attr == "useDept") {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: 'deptId',
                  hightFilter: true
                })
              } else {
                highFilterList.push({
                  id: e.id,
                  label: e.label,
                  attr: e.attr,
                  hightFilter: true
                })
              }
            }
          })
          highFilterList.push({
            id: 'printnumid0e01',
            label: "打印次数",
            attr: 'printSize',
            hightFilter: true
          });
          localStorage.setItem(highKey, JSON.stringify(highFilterList))
        }
        // 2.检测配置单自定义字段
        // 3.检测配置label是否改变，改变需要重写
      }
      context.commit("SET_ASSETTABLEHEADER", res.data);
    },
    async GET_ASSETSTATE(context) {
      const { data: res } = await select({
        func: "S0071",
        userId: context.state.userInfo._id,
        token: context.state.userInfo.token,
        requstData: {
          dictionaryId: "3ed47c5ae18e42bc894cf1bffb772bdb"
        },
      })
      if (res.code != 0) return this.$message.error(res.data);
      context.commit("SET_ASSETSTATE", res.data)
    },
    //入库方式
    async GET_STORAGEMETHOD (context) {
      const { data: res } = await select({
        func: "S0071",
        userId: context.state.userInfo._id,
        token: context.state.userInfo.token,
        requstData: {
          dictionaryId: "3ed47c5ae18e42bc894cf1bffb772bdc"
        },
      })
      if (res.code != 0) return this.$message.error(res.data);
      context.commit("SET_STORAGEMETHOD", res.data)
    }
  },
  modules: {},
  plugins: [
    persistedState({
      storage: window.sessionStorage,
    }),
  ],
});
