/**
 * 防抖
 * scroll事件滚动
 * 浏览器窗口的缩放resize事件
 * 搜索框输入查询的时候
 * 表单验证
 * 按钮的提交事件
 * @param {Function} fn
 * @param {Number} delay
 * @returns {Function} fn
 *
 */
export function debounce(fn, delay = 1000) {
  let time = null;
  return function () {
    // 获取当前this
    let that = this;
    // 判断是否已经存在，如果存在直接清除
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      // 使fn 中this，执行当前调用者，并传入参数
      fn.apply(that, arguments);
    }, delay);
  };
}
/**
 * 节流
 * DOM元素拖拽功能实现
 * 计算鼠标移动距离
 * 监听scroll滚动事件
 * 搜索、提交等按钮功能
 * @param {Function} fn
 * @param {Number} delay
 * @returns {Function} fn
 *
 */
export function throttle(fn, delay = 1000) {
  let time = null;
  return function () {
    let that = this;
    // 如果已经存在定时器了，则 不做处理
    if (!time) {
      time = setTimeout(() => {
        fn.apply(that, arguments);
        // 完结时，将time改为null
        time = null;
      }, delay);
    }
  };
}
/**
 * 点击下载或打开pdf
 * @param {String} URL
 * @param {String} DownloadFileName
 * @param {String} openMode
 */
export function clickDownloadLink(URL, openMode, DownloadFileName) {
  let linkTag = document.createElement("a");
  linkTag.href = URL;
  linkTag.target = openMode || "_self";
  if (DownloadFileName) linkTag.download = DownloadFileName;
  linkTag.click();
  linkTag = null;
}
/**
 *
 * @param {*} file
 * @returns
 */
export function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
}
/**
 *
 * @param {*} val
 * @returns
 */
export function base64Encode(val) {
  let rv;
  rv = encodeURIComponent(val);
  rv = unescape(rv);
  rv = window.btoa(rv);
  return rv;
}
/**
 *
 * @param {*} text
 * @returns
 */
export function countTableHeaderWidth(text) {
  // 判断是中文/英文(首个为准)
  let isEn = true;
  if (text.charCodeAt(0) >= 0x4E00 && text.charCodeAt(0) <= 0x9FFF) {
    isEn = false
  }
  if (isEn) return text.length * 7 + 80 + "px";
  else return text.length * 14 + 80 + "px";
}
/**
 *
 * @returns
 */
export function getTodayDate() {
  let d = new Date();
  let y = d.getFullYear();
  let m = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
  let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  return `${y}-${m}-${date}`;
}
/**
 *
 * @param {*} num
 * @returns
 *  四舍五入保留两位小数
 */
export function keepTwoDeciamllFull(num) {
  var result = parseInt(num);
  if (isNaN(result)) return num;
  result = Math.round(num * 100) / 100;
  var s_x = result.toString();
  var pos_decimal = s_x.indexOf(".");
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += ".";
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += "0";
  }
  return s_x;
}
/**
 *
 * @param {*} arr
 * @param {*} str
 * 遍历数组找出相同的值，组成新数组
 * @returns
 */
export function sortArr(arr, str) {
  let _arr = [],
    _t = [],
    // 临时的变量
    _tmp;
  // 按照特定的参数将数组排序将具有相同值得排在一起
  arr = arr.sort(function (a, b) {
    let s = a[str],
      t = b[str];
    return s < t ? -1 : 1;
  });
  if (arr.length) {
    _tmp = arr[0][str];
  }
  // console.log( arr );
  // 将相同类别的对象添加到统一个数组
  for (let i in arr) {
    if (arr[i][str] === _tmp) {
      _t.push(arr[i]);
    } else {
      _tmp = arr[i][str];
      _arr.push(_t);
      _t = [arr[i]];
    }
  }
  // 将最后的内容推出新数组
  _arr.push(_t);
  return _arr;
}
/**
 *
 * @param {*} headStr
 * @param {*} data
 * @param {*} fileName
 */
export const downLoadExcel = (headStr, data, fileName) => {
  //定义表头
  let str = headStr;

  // 增加\t为了不让表格显示科学计数法或者其他格式
  for (let i = 0; i < data.length; i++) {
    for (let item in data[i]) {
      str += `${data[i][item] + "\t"},`;
    }
    str += "\n";
  }

  //encodeURIComponent解决中文乱码
  const uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  // data:text/csv
  //通过创建a标签实现
  const link = document.createElement("a");
  link.href = uri;
  //对下载的文件命名
  link.download = `${fileName || "表格数据"}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
/**
 * 复杂数组去重
 * @param {*} arr 
 * @param {*} prop 
 * @returns 
 */
export const uniqueByProperty = (arr, prop) => {
  const unique = arr.map(e => e[prop])
    // 存储每个属性值对应的索引
    .map((e, i) => ({ [e]: i }))
    .reduce((a, b) => Object.assign(a, b), {})
    // 获取唯一属性值对应的元素
    .map(e => arr[e]);
  return unique;
}