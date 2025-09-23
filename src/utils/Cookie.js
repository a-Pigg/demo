/**
 * @author xxxx
 * @description 保存cookie
 * @param {String} name  需要存储cookie的key
 * @param {String} value  需要存储cookie的value
 * @param {Number} timer  默认存储多少秒
 */
export const setCookie = (name, value, timer) => {
  let d = new Date();
  d.setTime(d.getTime() + timer * 1000);
  // d.setTime(d.getTime() + timer * 3600000)
  d.setTime(d.getTime());
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires;
};

/**
 * @author xxxx
 * @description 获取cookie
 * @param {String} name 需要获取cookie的key
 */
export const getCookie = (name) => {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) {
    return encodeURIComponent(arr[2]);
  } else {
    return null;
  }
};

/**
 * @author xxxx
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
export const clearCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
