/**
 *
 * @onlineConfig.js ---> 线上接口
 * @$BAER_URL 业务接口
 * @PRINT_URL 打印接口
 * @SPCKER_URL webSocker
 * @ACCREDIT_URL 注册校验码接口
 * @PRINT_URL 新打印接口
 * @EXCEL_URL 导出资产路径
 */
let $BAER_URL = "https://asset.dascomyun.com/websocket/v1.1/"; //改
let $PRINT_URL = "http://127.0.0.1:20174/";
let $PRINT_URL2 = "http://127.0.0.1:7788/";
window.$BAER_URL = {
  anonym: $BAER_URL + "anonym/manage",
  update: $BAER_URL + "update/manage",
  select: $BAER_URL + "select/manage",
  deleteData: $BAER_URL + "delete/manage",
  sync: $BAER_URL + "sync/manage",
  operation: $BAER_URL + "operation/manage",
  getToken: $BAER_URL + "getToken",
  activate: $BAER_URL + "activateByCompany",
  tHeader: $BAER_URL + "AssetAlias",
  storage: $BAER_URL + "storage/manage",
};
window.$PRINT_URL = {
  print: $PRINT_URL + "/rfid/print2",
};
window.$PRINT_URL2 = {
  print: $PRINT_URL2 + "Service/",
};
window.$CODE_URL =
  "https://asset.dascomyun.com/activationCode/activationCode.html";
window.$MODEL_VIDEO = "http://120.238.245.234:58080/file/自定义模板.mp4"; //操作指引视频
window.$EXCEL_URL = "https://asset.dascomyun.com/websocket/upload/"; // 改
window.$SPCKET_URL = "wss://asset.dascomyun.com/websocket/HMWebSocket"; //webSocker  改
window.$ACCREDIT_URL =
  "https://info.dascomyun.com/operation_test/v1.1/verifyCode?code=";
