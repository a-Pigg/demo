// let $BAER_URL = "http://192.168.11.137:20174/v1.1/"; //涛
let $BAER_URL = "http://192.168.11.137:20170/v1.1/"; //涛
let $PRINT_URL = "http://127.0.0.1:20170/";
let $PRINT_URL2 = "http://127.0.0.1:7788/"; //本地地址
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
}; //业务
window.$PRINT_URL = {
  print: $PRINT_URL + "/rfid/print2",
}; //打印(old)
window.$PRINT_URL2 = {
  print: $PRINT_URL2 + "Service/",
}; //打印(new)

window.$CODE_URL =
  "https://asset.dascomyun.com/activationCode/activationCode.html";
window.$EXCEL_URL = "http://192.168.11.137:20170/upload/"; //导出资产路径
window.$MODEL_VIDEO = "http://120.238.245.234:58080/file/自定义模板.mp4"; //操作指引视频
window.$SPCKET_URL = "ws://192.168.11.137:20170/HMWebSocket/"; //webSocker
window.$ACCREDIT_URL =
  "https://info.dascomyun.com/operation_test/v1.1/verifyCode?code="; //校验码地址
