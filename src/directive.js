/**
 * el-select加载事件（可用于做select的无限滚动）
 * 使用方法（两种方法，推荐第2种）：
 * 1. 查询方法自定义（远程搜索也需要自定义）：
 *    v-load-more.method="function(){}"
 * 2. 传入url就可实现无限滚动和远程搜索，要求接口分页参数为“pageSize”和“pageNo”：
 *    v-load-more="{url:'operationSupport_qualification/ColBase/findAllByPage', options: relColIdOptions}"
 *    url:（必传）后端接口地址
 *    options:（必传）el-option中用来v-for的对象数组
 *    modelField: （必传）用于回显时查询用的字段以及返回时对应key的字段，这里两个字段合成一个了，如果想分开可自行调整
 *    pageSize:（非必传）每次加载的条数，不传则默认10
 *    model: （非 必传）用于回显时查询用的字段值，填了这一项才能回显，这一项和el-select的v-model相等，要求后端接口支持
 *           回显还有另一种用法，就是给options设置初始值，初始值内容为需要回显的内容
 *    searchField:（非必传）远程搜索用的字段，不传则不能实现远程搜索；
 *                要求接口支持和el-select开启搜索（filterable，并重置自定义搜索方法（:filter-method="()=>{}"））
 */
import Vue from "vue";
import { select } from "@/assets/api";
Vue.directive("loadMore", {
  bind(el, binding) {
    // 如果有method由调用方实现，没有则在这里实现加载和远程搜索的功能
    if (binding.modifiers.method) {
      // 方法一
      // 节流
      let timer;
      // 滚动监听
      el.querySelector(
        ".el-select-dropdown .el-select-dropdown__wrap"
      ).addEventListener("scroll", function () {
        const condition =
          this.scrollHeight - this.scrollTop <= this.clientHeight + 100;
        if (!timer && condition) {
          // 滚动加载（调用自定义的加载方法）
          binding.value();
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
          }, 500);
        }
      });
    } else {
      // 方法二
      // 传入的对象
      let value = binding.value;
      // 节流
      let timer;
      // 无搜索内容变量
      let pageNo = 1;
      let pages = 1;
      // 远程搜索内容变量
      let searchPageNo = 1;
      let searchPages = 1;
      // 每次加载的条数
      let pageSize = isNaN(value.pageSize) ? 10 : parseInt(value.pageSize);
      // 远程搜索变量
      let searchField = value.searchField;
      // 搜索固定内容
      let searchData = value.searchData;
      // 接口地址
      let func = value.func;
      let userInfo = value.userInfo;
      // let url = value.url;
      // 下拉数组，这个options在本方法中必须永远指向value.options，否则整个功能都将失效
      let options = value.options;
      // 无搜索拷贝数组，此处是为了在加载的基础上加一些默认的下拉项
      let optionsCopy = JSON.parse(JSON.stringify(value.options));
      // 远程搜索拷贝数组
      let optionsSearch = [];
      // 远程搜索内容
      let searchValue = "";
      // 加载逻辑
      const loadOptions = (searchField, search, searchData) => {
        let params = {
          func: func,
          userId: userInfo._id,
          token: userInfo.token,
          requstData: {
            page: pageSize,
          },
        };
        if (searchData) {
          Object.assign(params, searchData);
        }
        // 这里不能改变options的指向，否则会使整个功能失效（不能用options = []）
        options.length = 0;
        // 判断是否为远程搜索，true-是
        if (searchField && search) {
          // 当到最大页数时不再查询
          if (searchPages >= searchPageNo) {
            params.requstData.index = searchPageNo++;
            params.requstData[searchField] = search;
            select(params).then((res) => {
              if (res) {
                if (func == "S0005") {
                  searchPages = Math.ceil(res.data.data[1] / pageSize);
                  optionsSearch = optionsSearch.concat(res.data.data[0]);
                } else {
                  searchPages = Math.ceil(res.data.data[0] / pageSize);
                  optionsSearch = optionsSearch.concat(res.data.data[1]);
                }
                dataProcessing(optionsSearch);
              }
            });
          }
        } else {
          // 当到最大页数时不再查询
          if (pages >= pageNo) {
            params.requstData.index = pageNo++;
            select(params).then((res) => {
              if (res) {
                if (func == "S0005") {
                  pages = Math.ceil(res.data.data[1] / pageSize);
                  optionsCopy = optionsCopy.concat(res.data.data[0]);
                } else {
                  pages = Math.ceil(res.data.data[0] / pageSize);
                  optionsCopy = optionsCopy.concat(res.data.data[1]);
                }
                dataProcessing(optionsCopy);
              }
            });
          }
        }
      };
      // 返回数据处理
      let dataProcessing = (optionsCopy) => {
        // 这里不能改变options的指向，否则会使整个功能失效
        optionsCopy.forEach((item) => {
          let check = options.find((t) => {
            return t[value.modelField] === item[value.modelField];
          });
          if (!check) {
            options.push(item);
          }
        });
      };
      // 首次加载
      loadOptions(undefined, undefined, searchData);
      // 判断是否需要回显
      if (value.model && value.modelField) {
        // 回显方法
        let echo = (model, modelField, searchData) => {
          let params = {
            func: func,
            userId: userInfo._id,
            token: userInfo.token,
            requstData: {},
          };
          params.requstData[modelField] = model;
          if (searchData) {
            Object.assign(params, searchData);
          }
          select(params).then((res) => {
            if (res) {
              optionsCopy = optionsCopy.concat(res.data.data);
              dataProcessing(optionsCopy);
            }
          });
        };

        if (optionsCopy.length > 0) {
          let check = optionsCopy.find((item) => {
            return item[value.modelField] === value.model;
          });
          if (!check) {
            echo(value.model, value.modelField, searchData);
          }
        } else {
          echo(value.model, value.modelField, searchData);
        }
      }
      // 滚动监听（无限滚动）
      el.querySelector(
        ".el-select-dropdown .el-select-dropdown__wrap"
      ).addEventListener("scroll", function () {
        const condition =
          this.scrollHeight - this.scrollTop <= this.clientHeight + 100;
        if (!timer && condition) {
          // 滚动加载
          loadOptions(searchField, searchValue, searchData);
          timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
          }, 200);
        }
      });
      // 输入监听（远程搜索）
      if (searchField) {
        const elInput = el.getElementsByTagName("input")[0];
        // 输入搜索
        elInput.addEventListener("input", function () {
          if (this.value) {
            searchPageNo = 1;
            searchPages = 1;
            optionsSearch = [];
            searchValue = this.value;
            loadOptions(searchField, searchValue, searchData);
          } else {
            searchValue = "";
            dataProcessing(optionsCopy);
          }
        });
        // 失去焦点时清除输入内容
        elInput.addEventListener("blur", function () {
          searchValue = "";
          dataProcessing(optionsCopy);
        });
      }
    }
  },
});
