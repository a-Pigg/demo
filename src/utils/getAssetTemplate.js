import JsBarcode from "jsbarcode";
import QRCode from "qrcodejs2";
import { i18n } from "@/i18n/index";
/**
 * @param  tagItem      Object  必选      需要解析的JSON
 * @param  canvas       Object  必选      画布
 * @param  printData    Array   可选      资产数据
 * @param  isPrint      Boolean 可选      是否是正式打印
 * @param  printerDpi   String  可选      打印机DPI
 */
export const getCanvasTemplate = (
  tagItem,
  canvas,
  printData,
  isPrint,
  printerDpi
) => {
  // 画布初始设置
  canvas.style["display"] = "block";
  canvas.style.background = "#fff";
  // dpi(如果没有传值进来,则选择dpi为模板本身)
  let dpi = printerDpi == undefined ? tagItem.resolution : printerDpi;
  // 画布的字体大小  判断是否为300dpi,否则缩小2/3 为 203dpi
  let tagFontSize = tagItem.fontSize;
  tagFontSize = dpi != "300" ? (tagFontSize * 2) / 3 : tagFontSize;
  // 画布长度 (根据公式  (长度（毫米） / 25.4) * dpi  = 长度（px）)
  let canvasWidth = (tagItem.width / 25.4) * dpi;
  // 画布高度 (根据公式  (高度（毫米） / 25.4) * dpi  =  长度（px）)
  let canvasHeight = (tagItem.height / 25.4) * dpi;
  // 图片应当在什么位置开始  x轴
  let imageStartX = (tagItem.xorg / 25.4) * dpi;
  // 图片应当在什么位置开始  y轴
  let imageStartY = (tagItem.yorg / 25.4) * dpi;
  // 设置画布
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.font = `${tagFontSize}px ${tagItem.fontFace}`;
  // 指定背景图片
  // 生成背景图片
  let img = new Image();
  img.src = tagItem.txImg;
  // 先生成背景
  return new Promise((resolve, reject) => {
    img.onload = function () {
      // https://blog.csdn.net/ZLJ925/article/details/77923191
      img.onload = null;
      //  往画布贴图片
      if (dpi != "300")
        ctx.drawImage(img, imageStartX, imageStartY, canvasWidth, canvasHeight);
      else ctx.drawImage(img, imageStartX, imageStartY);
      // 判断该模板是否存在预印图片（即是rfid标签纸上已有的图片）调用打印的时候不用生成该图片，但是打印预览时需要展示出来
      if (tagItem.bkImg && !isPrint) {
        let logoImg = new Image();
        logoImg.src = tagItem.bkImg;
        logoImg.onload = function () {
          logoImg.onload = null;
          if (dpi != "300")
            ctx.drawImage(logoImg, 0, 0, canvasWidth, canvasHeight);
          else ctx.drawImage(logoImg, 0, 0);
          resolve();
        };
      }
      resolve();
    };
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        function fillContent(
          tagItem,
          i,
          dpi,
          printData,
          imageStartX,
          imageStartY,
          ctx,
          canvas
        ) {
          try {
            if (i >= tagItem.item.length) {
              if (printData) {
                resolve({
                  title: tagItem.title,
                  name: printData.name,
                  printDpi: dpi,
                  paperLen: (tagItem.height + 2) / 25.4,
                  paperWidth: (tagItem.width + 15) / 25.4,
                  EPC: printData.code,
                  assetCode: printData.assetCode,
                  base: canvas.toDataURL("image/png"),
                });
              } else {
                resolve({
                  id: tagItem._id,
                  title: tagItem.title,
                  paperLen: (tagItem.height + 2) / 25.4,
                  paperWidth: (tagItem.width + 15) / 25.4,
                  base: canvas.toDataURL("image/png"),
                });
              }
              return;
            }
            // 填充内容
            let tagContentItem = tagItem.item[i];
            if (
              printData &&
              printData[tagContentItem.name] != null &&
              printData[tagContentItem.name] == undefined
            ) {
              resolve({
                err: i18n.t('h.drawLabelComponents75'),
                title: tagItem.title,
                name: printData.name,
                printDpi: dpi,
                paperLen: (tagItem.height + 2) / 25.4,
                paperWidth: (tagItem.width + 15) / 25.4,
                EPC: printData.code,
                assetCode: printData.assetCode,
                base: require("@/assets/images/error.png"),
              });
              return;
            } else if (
              !printData &&
              tagContentItem.type != "img" &&
              !tagContentItem.data
            ) {
              resolve({
                err: i18n.t('h.drawLabelComponents75'),
                id: tagItem._id,
                title: tagItem.title,
                paperLen: (tagItem.height + 2) / 25.4,
                paperWidth: (tagItem.width + 15) / 25.4,
                base: require("@/assets/images/error.png"),
              });
              return;
            }
            if (tagContentItem.type == "text") {
              let contentCanvas = document.createElement("canvas");
              contentCanvas.style["display"] = "block";
              contentCanvas.style["background"] = "#fff";
              contentCanvas.width = (tagContentItem.width / 25.4) * dpi;
              contentCanvas.height = (tagContentItem.height / 25.4) * dpi;
              let contentCtx = contentCanvas.getContext("2d");
              contentCtx.fillStyle = "#000";
              contentCtx.font = `${tagFontSize}px ${tagContentItem.fontFace}`;
              contentCtx.textBaseline = "middle";
              if (tagContentItem.alignH == "center") {
                contentCtx.textAlign = "center";
                if (printData) {
                  if (printData[tagContentItem.name] == null)
                    printData[tagContentItem.name] = "";
                  // contentCtx.fillText(
                  //     printData[tagContentItem.name],
                  //     tagContentItem.width / 25.4 * dpi / 2,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      printData[tagContentItem.name],
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    ((tagContentItem.width / 25.4) * dpi) / 2,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                } else {
                  // contentCtx.fillText(
                  //     tagContentItem.data,
                  //     tagContentItem.width / 25.4 * dpi / 2,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      tagContentItem.data,
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    ((tagContentItem.width / 25.4) * dpi) / 2,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                }
              } else if (tagContentItem.alignH == "left") {
                contentCtx.textAlign = "left";
                if (printData) {
                  if (printData[tagContentItem.name] == null)
                    printData[tagContentItem.name] = "";
                  // contentCtx.fillText(
                  //     printData[tagContentItem.name],
                  //     5,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      printData[tagContentItem.name],
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    5,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                } else {
                  // contentCtx.fillText(
                  //     tagContentItem.data,
                  //     5,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      tagContentItem.data,
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    5,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                }
              } else if (tagContentItem.alignH == "right") {
                contentCtx.textAlign = "right";
                if (printData) {
                  if (printData[tagContentItem.name] == null)
                    printData[tagContentItem.name] = "";
                  // contentCtx.fillText(
                  //     printData[tagContentItem.name],
                  //     tagContentItem.width / 25.4 * dpi,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      printData[tagContentItem.name],
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    (tagContentItem.width / 25.4) * dpi,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                } else {
                  // contentCtx.fillText(
                  //     tagContentItem.data,
                  //     tagContentItem.width / 25.4 * dpi,
                  //     tagContentItem.height / 25.4 * dpi / 2 + 3
                  // )
                  contentCtx.fillText(
                    fittingString(
                      contentCtx,
                      tagContentItem.data,
                      (tagContentItem.width / 25.4) * dpi
                    ),
                    (tagContentItem.width / 25.4) * dpi,
                    ((tagContentItem.height / 25.4) * dpi) / 2 + 3
                  );
                }
              }
              let contentImg = new Image();
              contentImg.src = contentCanvas.toDataURL("image/png");
              contentImg.onload = function () {
                contentImg.onload = null;
                ctx.drawImage(
                  contentImg,
                  (tagContentItem.xpos / 25.4) * dpi + imageStartX / 2,
                  (tagContentItem.ypos / 25.4) * dpi + imageStartY
                );
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
              };
            } else if (tagContentItem.type == "code128") {
              let codeContent =
                printData == undefined
                  ? tagContentItem.data
                  : printData[tagContentItem.name];
              if (!codeContent) {
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
                return;
              }
              let oneCodeImg = new Image();
              JsBarcode(oneCodeImg, codeContent, {
                format: "CODE128", //选择要使用的条形码类型
                width: 2, //设置条之间的宽度
                height: 100, //高度
                displayValue: false, //是否在条形码下方显示文字
                textMargin: 5, //设置条形码和文本之间的间距
                fontSize: 15, //设置文本的大小
                background: "#fff", //设置条形码的背景
                lineColor: "#000", //设置条和文本的颜色。
                margin: 15, //设置条形码周围的空白边距
              });
              oneCodeImg.onload = function () {
                oneCodeImg.onload = null;
                ctx.drawImage(
                  oneCodeImg,
                  (tagContentItem.xpos / 25.4) * dpi + imageStartX + 1,
                  (tagContentItem.ypos / 25.4) * dpi + imageStartY + 1,
                  (tagContentItem.width / 25.4) * dpi,
                  (tagContentItem.height / 25.4) * dpi
                );
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
              };
            } else if (tagContentItem.type == "img") {
              let iImg = new Image();
              iImg.src = tagContentItem.data;
              iImg.onload = function () {
                iImg.onload = null;
                ctx.drawImage(
                  iImg,
                  (tagContentItem.xpos / 25.4) * dpi,
                  (tagContentItem.ypos / 25.4) * dpi,
                  (tagContentItem.width / 25.4) * dpi,
                  (tagContentItem.height / 25.4) * dpi
                );
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
              };
            } else {
              let codeContent =
                printData == undefined
                  ? tagContentItem.data
                  : printData[tagContentItem.name];
              if (!codeContent) {
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
                return;
              }
              let qrCodeBox = document.createElement("div");
              new QRCode(qrCodeBox, {
                text: codeContent,
                width: (tagContentItem.codeWidht / 25.4) * dpi,
                height: (tagContentItem.codeHeight / 25.4) * dpi,
                colorDark: "#000",
                colorLight: "#fff",
              });
              let qrCodeImg = qrCodeBox.lastChild;
              qrCodeImg.onload = function () {
                ctx.drawImage(
                  qrCodeImg,
                  (tagContentItem.xpos / 25.4) * dpi,
                  (tagContentItem.ypos / 25.4) * dpi,
                  (tagContentItem.codeWidht / 25.4) * dpi,
                  (tagContentItem.codeHeight / 25.4) * dpi
                );
                i += 1;
                fillContent(
                  tagItem,
                  i,
                  dpi,
                  printData,
                  imageStartX,
                  imageStartY,
                  ctx,
                  canvas
                );
              };
            }
          } catch (error) {
            console.log(error);
            resolve({
              err: i18n.t('h.drawLabelComponents75'),
              id: tagItem._id,
              title: tagItem.title,
              paperLen: (tagItem.height + 2) / 25.4,
              paperWidth: (tagItem.width + 15) / 25.4,
              base: require("@/assets/images/error.png"),
            });
            return;
          }
        }
        fillContent(
          tagItem,
          0,
          dpi,
          printData,
          imageStartX,
          imageStartY,
          ctx,
          canvas
        );
      });
    })
    .then((iBase64) => {
      return new Promise((resolve, reject) => {
        resolve(iBase64);
      });
    });
};

/**
 *
 * @param {Object} c
 * @param {String} str
 * @param {Number} maxWidth
 */
function fittingString(c, str, maxWidth) {
  let width = c.measureText(str).width;
  let ellipsis = "…";
  let ellipsisWidth = c.measureText(ellipsis).width;
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  } else {
    let len = str.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.substring(0, len);
      width = c.measureText(str).width;
    }
    return str + ellipsis;
  }
}
