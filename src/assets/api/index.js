import { get, post, pPost } from "./http";

export const anonym = (params) => post(window.$BAER_URL.anonym, params); // 匿名接口
export const update = (params) => post(window.$BAER_URL.update, params); // 增 改
export const deleteData = (params) => post(window.$BAER_URL.deleteData, params); // 删
export const select = (params) => post(window.$BAER_URL.select, params); // 查
export const operation = (params) => post(window.$BAER_URL.operation, params); //公告接口
export const sync = (params) => post(window.$BAER_URL.sync, params); // 备份接口
export const activate = (params) => post(window.$BAER_URL.activate, params);
export const warehouseOperate = (params) => post(window.$BAER_URL.storage, params); // 仓库业务接口
//白名单
export const checkCode = (params) => post(window.$BAER_URL.checkCode, params);

// 打印接口
export const printPost = (method, params, data) =>
  pPost(window.$PRINT_URL2.print, method, params, data);
export const printGet = (params) => get(window.$PRINT_URL2.print, params);

// 门禁设备接口
// 链接设备
export const connectpost = (params) => post(window.$PRINT_URL2.connect, params);
// 获取经过资产epc
export const getepcpost = (params) => post(window.$PRINT_URL2.getepc, params);
// 发出警告
export const warningpost = (params) => post(window.$PRINT_URL2.warning, params);
// 断开设备
export const disconnectpost = (params) => post(window.$PRINT_URL2.disconnect, params);
// 一键盘点接口
// 开启一键盘点
export const openCheck = (params, ip) => post(ip || window.$PRINT_URL2.openCheck, params);
// 获取盘点EPC
export const getCheckEPC = (params, ip) => post(ip || window.$PRINT_URL2.getCheckEPC, params);
// 关闭一键盘点
export const closeCheck = (params, ip) => post(ip || window.$PRINT_URL2.closeCheck, params);