/**
 * @description：生成可打印的单据图片
 * @param {*} canvas  画布节点
 * @param {JSON} rootJSON 用于生成画布的json
 * @param {boolean} tableFlag 用于判断是否需要画表格
 * @param {Object} tableData 填充所需数据
 * @param {Array} assetData 单据表格中的资产数据
 * @returns 图片base64
 */
export const createVoucherTags = (
  canvas,
  rootJSON,
  tableFlag,
  tableData,
  assetData
) => {
  const dpi = rootJSON.resolution; //打印鸡dpi
  const canvasWidth = (rootJSON.width / 25.4) * dpi; //画布宽度
  const canvasHeight = (rootJSON.height / 25.4) * dpi; //画布高度
  const imageStartX = (rootJSON.xorg / 25.4) * dpi; //图片在画布中的起点位置X
  const imageStartY = (rootJSON.yorg / 25.4) * dpi; //图片在画布中的起点位置Y
  const transitionPX = 25.4 / dpi;
  // 设置画布
  canvas.style["display"] = "block";
  canvas.style.background = "#fff";
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // 开始绘画 tips:需先给画布渲染一层白色矩形,不然打印效果会为全黑
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  const img = new Image();
  img.src = rootJSON.txImg;
  return new Promise((resolve, reject) => {
    img.onload = function () {
      ctx.drawImage(img, imageStartX, imageStartY);
      if (rootJSON.bkImg) {
        const logoImg = new Image();
        logoImg.src = rootJSON.bkImg;
        logoImg.onload = function () {
          ctx.drawImage(logoImg, 0, 0);
          resolve();
        };
      }
      ctx.font = `${rootJSON.fontSize}px ${rootJSON.fontFace}`;
      resolve();
    };
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        function recVoucherImg(i) {
          const itemInfo = rootJSON.item[i];
          // 开始填充内容
          if (itemInfo.type == "text") {
            // 每段内容以画布形式贴上去
            const alignH = itemInfo.alignH;
            const itemWidth = itemInfo.width;
            const itemHeight = itemInfo.height;
            const contextCanvas = createCanvas(
              itemWidth / transitionPX,
              itemHeight / transitionPX
            );
            const contextCtx = setCanvasCSS(
              contextCanvas,
              rootJSON.fontSize,
              rootJSON.fontFace
            );
            // 区分水平居中还是居左
            if (alignH == "center") {
              contextCtx.textAlign = "center";
              if (tableData) {
                let title = "";
                if (tableData[itemInfo.name]) title = tableData[itemInfo.name];
                // contextCtx.fillText(title, itemWidth / transitionPX / 2, itemHeight / transitionPX / 2 + 3)
                contextCtx.fillText(
                  fittingString(contextCtx, title, itemWidth / transitionPX),
                  itemWidth / transitionPX / 2,
                  itemHeight / transitionPX / 2 + 3
                );
              } else {
                // contextCtx.fillText(itemInfo.data, itemWidth / transitionPX / 2, itemHeight / transitionPX / 2 + 3)
                contextCtx.fillText(
                  fittingString(
                    contextCtx,
                    itemInfo.data,
                    itemWidth / transitionPX
                  ),
                  itemWidth / transitionPX / 2,
                  itemHeight / transitionPX / 2 + 3
                );
              }
            } else {
              if (tableData) {
                let title = "";
                if (tableData[itemInfo.name]) title = tableData[itemInfo.name];
                // contextCtx.fillText(title, 5, itemHeight / transitionPX / 2 + 3)
                contextCtx.fillText(
                  fittingString(contextCtx, title, itemWidth / transitionPX),
                  5,
                  itemHeight / transitionPX / 2 + 3
                );
              } else {
                // contextCtx.fillText(itemInfo.data, 5, itemHeight / transitionPX / 2 + 3)
                contextCtx.fillText(
                  fittingString(
                    contextCtx,
                    itemInfo.data,
                    itemWidth / transitionPX
                  ),
                  5,
                  itemHeight / transitionPX / 2 + 3
                );
              }
            }
            const contentImg = new Image();
            contentImg.src = contextCanvas.toDataURL("image/png");
            contentImg.onload = function () {
              ctx.drawImage(
                contentImg,
                itemInfo.xpos / transitionPX + imageStartX / 2,
                itemInfo.ypos / transitionPX + imageStartY
              );
              if (i == rootJSON.item.length - 2 && !tableFlag) {
                resolve(canvas.toDataURL("image/png"));
                return false;
              }
              i += 1;
              recVoucherImg(i);
            };
          } else if (itemInfo.type == "table") {
            const recTableImg = function (j) {
              const itemDataInfo = itemInfo.itemData[j];
              const itemWidth = itemDataInfo.width;
              const itemHeight = itemDataInfo.height;
              const itemInterval = itemDataInfo.interval;
              const recTableDataImg = function (k) {
                const tableAlignH = itemDataInfo.alignH;
                const tableCanvas = createCanvas(
                  itemWidth / transitionPX,
                  itemHeight / transitionPX
                );
                // const tableCtx = setCanvasCSS(tableCanvas, rootJSON.fontSize, rootJSON.fontFace);
                const tableCtx = setCanvasCSS(
                  tableCanvas,
                  18,
                  rootJSON.fontFace
                );
                if (tableAlignH == "center") {
                  tableCtx.textAlign = "center";
                  if (itemDataInfo.name == "index") {
                    // tableCtx.fillText(k + 1, itemWidth / transitionPX / 2, itemHeight / transitionPX / 2 + 3,)
                    tableCtx.fillText(
                      fittingString(tableCtx, k + 1, itemWidth / transitionPX),
                      itemWidth / transitionPX / 2,
                      itemHeight / transitionPX / 2 + 3
                    );
                  } else {
                    let printData = assetData[k][itemDataInfo.name];
                    if (!printData) printData = "";
                    // tableCtx.fillText(printData, itemWidth / transitionPX / 2, itemHeight / transitionPX / 2 + 3,)
                    tableCtx.fillText(
                      fittingString(
                        tableCtx,
                        printData,
                        itemWidth / transitionPX
                      ),
                      itemWidth / transitionPX / 2,
                      itemHeight / transitionPX / 2 + 3
                    );
                  }
                } else {
                  if (itemDataInfo.name == "index") {
                    // tableCtx.fillText(k + 1, 5, itemHeight / transitionPX / 2 + 3,)
                    tableCtx.fillText(
                      fittingString(tableCtx, k + 1, itemWidth / transitionPX),
                      5,
                      itemHeight / transitionPX / 2 + 3
                    );
                  } else {
                    let printData = assetData[k][itemDataInfo.name];
                    if (!printData) printData = "";
                    // tableCtx.fillText(printData, 5, itemHeight / transitionPX / 2 + 3,)
                    tableCtx.fillText(
                      fittingString(
                        tableCtx,
                        printData,
                        itemWidth / transitionPX
                      ),
                      5,
                      itemHeight / transitionPX / 2 + 3
                    );
                  }
                }
                const tableImg = new Image();
                tableImg.src = tableCanvas.toDataURL("image/png");
                tableImg.onload = function () {
                  const num = itemDataInfo.ypos + itemInterval * k;
                  ctx.drawImage(
                    tableImg,
                    itemDataInfo.xpos / transitionPX + imageStartX / 2,
                    num / transitionPX + imageStartY
                  );
                  if (
                    j == itemInfo.itemData.length - 1 &&
                    k == assetData.length - 1
                  ) {
                    resolve(canvas.toDataURL("image/png"));
                  }
                  if (
                    k == assetData.length - 1 &&
                    j < itemInfo.itemData.length - 1
                  ) {
                    j += 1;
                    recTableImg(j);
                  } else {
                    if (k < assetData.length - 1) {
                      k += 1;
                      recTableDataImg(k);
                    }
                  }
                };
              };
              recTableDataImg(0);
            };
            recTableImg(0);
          }
        }
        recVoucherImg(0);
      });
    })
    .then((base64) => {
      return new Promise((resolve, reject) => {
        resolve(base64);
      });
    });
};


// export const createVoucherTags = (
//   canvas,
//   rootJSON,
//   tableFlag,
//   tableData,
//   assetData
// ) => {
//   const dpi = rootJSON.resolution; //打印鸡dpi
//   const canvasWidth = (rootJSON.width / 25.4) * dpi; //画布宽度
//   const canvasHeight = (rootJSON.height / 25.4) * dpi; //画布高度
//   const imageStartX = (rootJSON.xorg / 25.4) * dpi; //图片在画布中的起点位置X
//   const imageStartY = (rootJSON.yorg / 25.4) * dpi; //图片在画布中的起点位置Y
//   const transitionPX = 25.4 / dpi;
//   // 设置画布
//   canvas.style["display"] = "block";
//   canvas.style.background = "#fff";
//   canvas.width = canvasWidth;
//   canvas.height = canvasHeight;
//   // 开始绘画 tips:需先给画布渲染一层白色矩形,不然打印效果会为全黑
//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = "#fff";
//   ctx.fillRect(0, 0, canvasWidth, canvasHeight);
//   const img = new Image();
//   img.src = rootJSON.txImg;
//   return new Promise((resolve, reject) => {
//     img.onload = function () {
//       ctx.drawImage(img, imageStartX, imageStartY);
//       if (rootJSON.bkImg) {
//         const logoImg = new Image();
//         logoImg.src = rootJSON.bkImg;
//         logoImg.onload = function () {
//           ctx.drawImage(logoImg, 0, 0);
//           resolve();
//         };
//       }
//       ctx.font = `${rootJSON.fontSize}px ${rootJSON.fontFace}`;
//       resolve();
//     };
//   })
//     .then(() => {
//       return new Promise((resolve, reject) => {
//         function recVoucherImg(i) {
//           const itemInfo = rootJSON.item[i];
//           // === 临时注释开始 ===
//           /*
//           // 开始填充内容
//           if (itemInfo.type == "text") {
//             ...
//             // 所有与文本绘制相关的逻辑都被注释掉了。
//           } else if (itemInfo.type == "table") {
//             ...
//             // 所有与表格绘制相关的逻辑都被注释掉了。
//           }
//           */
//           // === 临时注释结束 ===
//           if (i < rootJSON.item.length - 1) {
//             i += 1;
//             recVoucherImg(i);
//           } else {
//             resolve(canvas.toDataURL("image/png"));
//           }
//         }
//         recVoucherImg(0);
//       });
//     })
//     .then((base64) => {
//       return new Promise((resolve, reject) => {
//         resolve(base64);
//       });
//     });
// };
/**
 * @description：生成画布
 * @param {*} width  画布的宽度
 * @param {*} height  画布的高度
 * @returns 画布节点
 */
function createCanvas(width, height) {
  const contentCanvas = document.createElement("canvas");
  contentCanvas.style["display"] = "block";
  contentCanvas.style.background = "#fff";
  contentCanvas.width = width;
  contentCanvas.height = height;
  return contentCanvas;
}
/**
 * @description：设置画布
 * @param {*} canvasElement  画布节点
 * @param {*} fontSize    画布文字大小
 * @param {*} fontFace    画布文字大小
 * @returns  canvas的2d对象上下文
 */
function setCanvasCSS(canvasElement, fontSize, fontFace) {
  const contentCtx = canvasElement.getContext("2d");
  contentCtx.fillStyle = "#000";
  contentCtx.font = `${fontSize}px ${fontFace}`;
  contentCtx.textBaseline = "middle";
  return contentCtx;
}

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
